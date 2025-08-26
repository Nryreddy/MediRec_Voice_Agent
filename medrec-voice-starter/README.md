# MedRec Voice — Next.js + FastAPI + n8n (Starter)

This is a minimal scaffold to test your **n8n webhook** with a **Next.js** frontend and a **FastAPI** backend.

## Quick Start
1. **Create an n8n Webhook** node and copy its **Production URL**.
2. Set backend env:
   ```bash
   cp backend/.env.example backend/.env
   # edit N8N_WEBHOOK_URL=... (use your production webhook URL)
   ```
3. Set frontend env (optional fallback link):
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   # edit NEXT_PUBLIC_BACKEND_URL (defaults to http://localhost:8000)
   # optional: NEXT_PUBLIC_N8N_WEBHOOK_URL to show a direct \"Open n8n Webhook\" button
   ```
4. **Run**:
   ```bash
   docker compose up --build
   ```
5. Open **http://localhost:3000** → fill form → **Start Call**. The backend will POST JSON to n8n.

## What gets sent to n8n
```json
{
  "source": "medrec-voice-starter",
  "event": "start_call",
  "payload": {
    "patient_id": "P001",
    "name": "Sam Lee",
    "phone": "+61 ...",
    "language": "en",
    "surgery_type": "Appendectomy",
    "extras": null
  }
}
```

## Endpoints
- Backend health: `GET http://localhost:8000/healthz`
- Start call: `POST http://localhost:8000/api/start`

## Notes
- Add authentication and request signing for production.
- Use n8n to branch into voice or SMS flows, booking, alerts, etc.