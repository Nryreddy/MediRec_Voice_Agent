import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const N8N_FALLBACK = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "";

export default function Home() {
  const [form, setForm] = useState({
    patient_id: "P001",
    name: "Sam Lee",
    phone: "+61 ",
    language: "en",
    surgery_type: "Appendectomy"
  });
  const [status, setStatus] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startCall = async () => {
    setStatus("Starting...");
    try {
      const r = await fetch(`${BACKEND}/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (j.ok) {
        setStatus("✅ Sent to n8n webhook. Check your workflow execution.");
      } else {
        setStatus("⚠️ Backend responded but not OK: " + (j.status || ""));
      }
    } catch (e) {
      setStatus("❌ Error: " + e.message);
    }
  };

  return (
    <main style={{fontFamily:"Inter, system-ui, Arial", padding:"2rem", maxWidth:860, margin:"0 auto"}}>
      <h1>MedRec Voice — Starter</h1>
      <p>Fill details and click <b>Start Call</b>. The backend will POST to your n8n webhook.</p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginTop:"1.5rem"}}>
        <label>Patient ID
          <input name="patient_id" value={form.patient_id} onChange={onChange} style={inp}/>
        </label>
        <label>Name
          <input name="name" value={form.name} onChange={onChange} style={inp}/>
        </label>
        <label>Phone
          <input name="phone" value={form.phone} onChange={onChange} style={inp}/>
        </label>
        <label>Language
          <select name="language" value={form.language} onChange={onChange} style={inp}>
            <option value="en">English</option>
            <option value="zh">中文 (Chinese)</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </label>
        <label>Surgery Type
          <input name="surgery_type" value={form.surgery_type} onChange={onChange} style={inp}/>
        </label>
      </div>

      <div style={{display:"flex", gap:"1rem", marginTop:"2rem"}}>
        <button onClick={startCall} style={btn}>Start Call</button>
        {N8N_FALLBACK ? (
          <a href={N8N_FALLBACK} target="_blank" rel="noreferrer" style={btnSecondary}>
            Open n8n Webhook (fallback)
          </a>
        ) : null}
      </div>

      <p style={{marginTop:"1rem"}}>{status}</p>

      <style jsx>{`
        label { display:flex; flex-direction:column; font-size:14px; gap:6px; }
      `}</style>
    </main>
  );
}

const inp = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  width: "100%"
};

const btn = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  background: "black",
  color: "white",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "white",
  color: "black",
  textDecoration: "none"
};