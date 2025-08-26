import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "").strip()

app = FastAPI(title="MedRec Voice Starter API")

# CORS for local Next.js and general dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartPayload(BaseModel):
    patient_id: str = Field(..., example="P001")
    name: str = Field(..., example="Sam Lee")
    phone: str = Field(..., example="+61 400 000 000")
    language: str = Field("en", example="en")
    surgery_type: Optional[str] = Field(None, example="Appendectomy")
    extras: Optional[Dict[str, Any]] = None

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.post("/api/start")
async def start_call(payload: StartPayload):
    """
    Forwards payload to the configured n8n webhook.
    """
    if not N8N_WEBHOOK_URL:
        raise HTTPException(status_code=500, detail="N8N_WEBHOOK_URL is not set on the backend")

    data = {
        "source": "medrec-voice-starter",
        "event": "start_call",
        "payload": payload.dict()
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            # Prefer POST to n8n webhook
            r = await client.post(N8N_WEBHOOK_URL, json=data)
            ok = 200 <= r.status_code < 300
            return {"ok": ok, "status": r.status_code, "n8n_response": r.text[:1000]}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error contacting n8n webhook: {e}")