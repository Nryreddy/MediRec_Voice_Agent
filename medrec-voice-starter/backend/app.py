# app.py
import os
from typing import Optional, Dict, Any, List
from urllib.parse import quote

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------
# Env & config
# -----------------------------
AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID")
AIRTABLE_TABLE   = os.getenv("AIRTABLE_TABLE", "Patients_PostOp")
AIRTABLE_VIEW    = os.getenv("AIRTABLE_VIEW")  # optional
N8N_WEBHOOK_URL  = os.getenv("N8N_WEBHOOK_URL")

CORS = os.getenv("CORS_ORIGINS", "*").split(",")

# Airtable column mapping (edit if your column names differ)
FIELDS = {
    "id": "Patient ID",
    "first": "First name",
    "last": "Last name",
    "dob": "DoB",
    "gender": "Gender",
    "surgery": "surgery_type",
    "procedure_date": "Procedure Date",
    "care_plan": "Care Plan (Immediate Post-Op)",
    "discharge": "Discharge Instructions",
    "meds": "Medications (JSON)",
    "next_followup": "Next Follow-Up Date",
    "must_ask": "Must-Ask Question (next call)",
    "phone": "Phone",
}

AIRTABLE_API = "https://api.airtable.com/v0"

# -----------------------------
# FastAPI app (define FIRST)
# -----------------------------
app = FastAPI(title="MedRec Voice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Airtable helpers
# -----------------------------
def _airtable_client() -> httpx.Client:
    if not (AIRTABLE_API_KEY and AIRTABLE_BASE_ID and AIRTABLE_TABLE):
        raise RuntimeError(
            "Missing Airtable env. Set AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE."
        )
    return httpx.Client(
        headers={"Authorization": f"Bearer {AIRTABLE_API_KEY}"},
        timeout=20.0,
    )

def _table_url() -> str:
    return f"{AIRTABLE_API}/{AIRTABLE_BASE_ID}/{quote(AIRTABLE_TABLE)}"

def list_patients(limit: int = 200) -> List[Dict[str, Any]]:
    """Light list for grid."""
    out: List[Dict[str, Any]] = []
    params: Dict[str, Any] = {}
    if AIRTABLE_VIEW:
        params["view"] = AIRTABLE_VIEW

    with _airtable_client() as c:
        offset: Optional[str] = None
        while True:
            qp = params.copy()
            if offset:
                qp["offset"] = offset
            r = c.get(_table_url(), params=qp)
            r.raise_for_status()
            payload = r.json()
            for rec in payload.get("records", []):
                f = rec.get("fields", {})
                row = {
                    "patient_id": f.get(FIELDS["id"]),
                    "first": f.get(FIELDS["first"]),
                    "last": f.get(FIELDS["last"]),
                    "dob": f.get(FIELDS["dob"]),
                    "procedure_date": f.get(FIELDS["procedure_date"]),
                    "surgery_type": f.get(FIELDS["surgery"]),
                    "phone": f.get(FIELDS["phone"]),
                }
                if row["patient_id"]:
                    out.append(row)
            offset = payload.get("offset")
            if not offset or len(out) >= limit:
                break
    return out

def get_patient_by_id(patient_id: str) -> Optional[Dict[str, Any]]:
    """Fetch one row by Patient ID (exact match)."""
    formula = f"{{{FIELDS['id']}}}='{patient_id}'"
    params: Dict[str, Any] = {"filterByFormula": formula, "maxRecords": 1}
    if AIRTABLE_VIEW:
        params["view"] = AIRTABLE_VIEW

    with _airtable_client() as c:
        r = c.get(_table_url(), params=params)
        r.raise_for_status()
        recs = r.json().get("records", [])
        if not recs:
            return None
        rec = recs[0]
        f = rec.get("fields", {})
        return {
            "airtable_id": rec.get("id"),             # <-- add this
            "patient_id": f.get(FIELDS["id"]),
            "first": f.get(FIELDS["first"]),
            "last": f.get(FIELDS["last"]),
            "dob": f.get(FIELDS["dob"]),
            "gender": f.get(FIELDS["gender"]),
            "procedure_date": f.get(FIELDS["procedure_date"]),
            "surgery_type": f.get(FIELDS["surgery"]),
            "care_plan": f.get(FIELDS["care_plan"]),
            "discharge": f.get(FIELDS["discharge"]),
            "meds": f.get(FIELDS["meds"]),
            "next_followup": f.get(FIELDS["next_followup"]),
            "must_ask": f.get(FIELDS["must_ask"]),
            "phone": f.get(FIELDS["phone"]),
        }


# -----------------------------
# Routes
# -----------------------------
@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/api/patients")
def api_patients():
    try:
        items = list_patients()
        return {"items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class StartIn(BaseModel):
    patient_id: str
    name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None
    surgery_type: Optional[str] = None

@app.post("/api/start")
def api_start(body: StartIn):
    if not N8N_WEBHOOK_URL:
        raise HTTPException(status_code=500, detail="N8N_WEBHOOK_URL not configured")

    patient = get_patient_by_id(body.patient_id)
    if not patient and not (body.name and body.phone):
        raise HTTPException(status_code=404, detail=f"Patient {body.patient_id} not found in Airtable")

    first = (patient or {}).get("first") or (body.name or "").strip()
    last  = (patient or {}).get("last")
    name = (body.name or first or "").strip()  # first name only

    phone    = body.phone or (patient.get("phone") if patient else None)
    language = body.language or "en"
    surgery  = body.surgery_type or (patient.get("surgery_type") if patient else None)

    if not phone:
        raise HTTPException(status_code=400, detail="No phone available (add 'Phone' in Airtable or pass one).")

    airtable_id = (patient or {}).get("airtable_id")   # <-- record ID

    gender   = (patient or {}).get("gender")
    careplan = (patient or {}).get("care_plan")
    meds     = (patient or {}).get("meds")
    mustask  = (patient or {}).get("must_ask")

    payload = {
        "source": "medrec-voice-starter",
        "event": "start_call",
        "payload": {
            "airtable_id": airtable_id,     # <-- include record ID for n8n updates
            "patient_id": body.patient_id,

            # names
            "name":  name,                  # first name only
            "first": first,
            "last":  last,

            "phone": phone,
            "language": language,
            "surgery_type": surgery,

            # clean keys
            "gender": gender,
            "care_plan": careplan,
            "medications_json": meds,
            "must_ask": mustask,

            # human labels (optional)
            "Gender": gender,
            "Care Plan (Immediate Post-Op)": careplan,
            "Medications (JSON)": meds,
            "Must-Ask Question (next call)": mustask,
        },
    }

    try:
        with httpx.Client(timeout=20.0) as c:
            r = c.post(N8N_WEBHOOK_URL, json=payload)
            ok = 200 <= r.status_code < 300
            return {"ok": ok, "status": r.status_code, "airtable_id": airtable_id, "n8n": None if ok else r.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to call n8n: {e}")


# Local debug (not used by Docker CMD)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
