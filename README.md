# MedRec Voice — Next.js + FastAPI + n8n (Starter)

A tiny, production-shaped scaffold to trigger **n8n** workflows from a **Next.js** form via a **FastAPI** backend. Perfect for post-op check-ins, medication reconciliation flows, or any “start a call → orchestrate in n8n” use case.

---

## What this starter does

* **Frontend (Next.js 14)**: simple patient form → `POST /api/start`.
* **Backend (FastAPI)**: validates input, normalizes phone, signs the payload, and **POSTs to your n8n Webhook**.
* **n8n**: receives JSON and you branch to voice/SMS/booking/alerts.

> Uses Docker Compose so it “just runs” on any machine with Docker.

---

## Repo layout

```
.
├─ backend/
│  ├─ main.py                 # FastAPI app
│  ├─ security.py             # (optional) HMAC request signer/verifier
│  ├─ requirements.txt
│  └─ .env.example            # copy to .env
├─ frontend/
│  ├─ app/                    # Next.js app router pages
│  ├─ components/
│  ├─ package.json
│  └─ .env.local.example      # copy to .env.local
├─ docker-compose.yml
└─ README.md                  # this file
```

---

## Prerequisites

* **Docker Desktop** (Windows/Mac) or **Docker Engine + Compose** (Linux)
* An **n8n** instance (Cloud or self-hosted)

  * Create a **Webhook** node with **POST** method and a path (e.g. `medrec-call-start`)
  * During testing: use the **Test URL**
  * For real traffic: **Activate** the workflow and use the **Production URL**

---

## 1) Configure environment files

### Backend (`backend/.env`)

```ini
# REQUIRED — your n8n Webhook URL
# Use TEST url while debugging, then switch to PRODUCTION url once the workflow is activated.
N8N_WEBHOOK_URL=https://<your-subdomain>.app.n8n.cloud/webhook-test/medrec-call-start

# OPTIONAL — enable HMAC signing for the request we send to n8n
SIGNING_SECRET=change_me_please

# CORS (comma-separated origins). Defaults to * for local dev.
CORS_ORIGINS=http://localhost:3000

# Port FastAPI will bind to inside container
PORT=8000
```

> When you switch to production, change `.../webhook-test/...` to `.../webhook/...`.

### Frontend (`frontend/.env.local`)

```ini
# Backend base URL the Next.js app will call
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: show a direct link button to your n8n Webhook (handy for quick tests)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://<your-subdomain>.app.n8n.cloud/webhook-test/medrec-call-start
```

---

## 2) Start everything

```bash
docker compose up --build
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend:  [http://localhost:8000](http://localhost:8000) (health: `/healthz`)

---

## 3) Use it

1. Open **[http://localhost:3000](http://localhost:3000)**
2. Fill the form (name, phone in **E.164** like `+61412345678`, language, surgery type, patient ID).
3. Click **Start Call**.
4. The backend will `POST` a signed payload to your n8n Webhook.
5. In n8n, the Webhook node should catch the execution; inspect data in the **Executions** panel.

```


## 4) License & attribution

Use freely for prototypes and demos. Replace clinical content with your own protocols before real-world use.

---

## 5) Changelog (starter)

* **v0.1.0** – First release: Next.js form → FastAPI → n8n Webhook (+ optional HMAC signing).
