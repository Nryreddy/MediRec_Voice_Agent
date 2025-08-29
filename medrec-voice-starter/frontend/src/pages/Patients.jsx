import React, { useEffect, useMemo, useState } from "react";

const BACKEND =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const N8N_FALLBACK =
  import.meta.env.VITE_N8N_WEBHOOK_URL || "";

export default function Patients() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  // sorting
  const [sortKey, setSortKey] = useState("procedure_date"); // 'patient_id' | 'first' | 'last' | 'dob' | 'procedure_date'
  const [sortDir, setSortDir] = useState("desc");           // 'asc' | 'desc'

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${BACKEND}/api/patients`, { cache: "no-store" });
        const j = await r.json();
        setRows(Array.isArray(j.items) ? j.items : []);
      } catch (e) {
        setToast({ kind: "err", msg: `Failed to load patients: ${e.message}` });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = useMemo(() => {
    const s = [...rows].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString();
      const bv = (b[sortKey] ?? "").toString();
      if (sortKey === "dob" || sortKey === "procedure_date") {
        const ad = new Date(av).getTime() || 0;
        const bd = new Date(bv).getTime() || 0;
        return sortDir === "asc" ? ad - bd : bd - ad;
      }
      const cmp = av.localeCompare(bv, undefined, { sensitivity: "base", numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return s;
  }, [rows, sortKey, sortDir]);

  const onSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const callPatient = async (p) => {
    setBusyId(p.patient_id);
    setToast({ kind: "info", msg: `Starting call for ${p.first ?? ""} ${p.last ?? ""}…` });
    try {
      const r = await fetch(`${BACKEND}/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: p.patient_id }),
      });
      const j = await r.json();
      if (j.ok) setToast({ kind: "ok", msg: "✅ Sent to n8n. Check workflow executions." });
      else setToast({ kind: "warn", msg: `⚠️ Backend responded but not OK: ${j.status}` });
    } catch (e) {
      setToast({ kind: "err", msg: `❌ ${e.message}` });
    } finally {
      setBusyId(null);
      setTimeout(() => setToast(null), 3200);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl text-white font-bold shadow bg-gradient-to-br from-blue-400 to-indigo-500">
              ✺
            </span>
            <div>
              <h1 className="m-0 text-lg font-semibold">MedRec Voice</h1>
              <p className="m-0 text-sm text-slate-500">
                Post-op patient outreach — fast, reliable, and human.
              </p>
            </div>
          </div>

          {N8N_FALLBACK ? (
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => {
                const p = sorted[0]; if (!p) return;
                fetch(N8N_FALLBACK, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    source: "medrec-voice-starter",
                    event: "start_call",
                    payload: { patient_id: p.patient_id }
                  }),
                });
                setToast({ kind: "ok", msg: "✅ Posted to n8n webhook (fallback)." });
                setTimeout(() => setToast(null), 3000);
              }}
            >
              Test n8n Webhook
            </button>
          ) : null}
        </div>
      </header>

      {/* Table */}
      <section className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Patients</h2>
              <span className="text-slate-500">{rows.length} total</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <SortBtn label="ID" active={sortKey === "patient_id"} dir={sortDir} onClick={() => onSort("patient_id")} />
              <SortBtn label="First" active={sortKey === "first"} dir={sortDir} onClick={() => onSort("first")} />
              <SortBtn label="Last" active={sortKey === "last"} dir={sortDir} onClick={() => onSort("last")} />
              <SortBtn label="DoB" active={sortKey === "dob"} dir={sortDir} onClick={() => onSort("dob")} />
              <SortBtn label="Procedure" active={sortKey === "procedure_date"} dir={sortDir} onClick={() => onSort("procedure_date")} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: "16%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "10%" }} />
              </colgroup>
              <thead className="text-left text-sm text-slate-600">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2">Patient ID</th>
                  <th className="px-3 py-2">First</th>
                  <th className="px-3 py-2">Last</th>
                  <th className="px-3 py-2">DoB</th>
                  <th className="px-3 py-2">Procedure Date</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <SkeletonRows cols={6} />}
                {!loading && sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-slate-500">
                      No patients.
                    </td>
                  </tr>
                )}
                {!loading && sorted.map((p) => (
                  <tr key={p.patient_id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2" title={p.patient_id}>
                      <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-900">
                        {p.patient_id}
                      </span>
                    </td>
                    <td className="px-3 py-2 truncate" title={p.first || ""}>{p.first || "—"}</td>
                    <td className="px-3 py-2 truncate" title={p.last || ""}>{p.last || "—"}</td>
                    <td className="px-3 py-2" title={p.dob || ""}>
                      <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                        {fmtDate(p.dob)}
                      </span>
                    </td>
                    <td className="px-3 py-2" title={p.procedure_date || ""}>
                      <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                        {fmtDate(p.procedure_date)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => callPatient(p)}
                        disabled={busyId === p.patient_id || !p.phone}
                        title={p.phone ? "Start call" : "No phone on file"}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-50"
                      >
                        {busyId === p.patient_id ? <Loader/> : <PhoneIcon/>}
                        Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {toast && (
        <div
          className={[
            "fixed bottom-6 right-6 rounded-xl border bg-white px-4 py-3 shadow-lg",
            toast.kind === "ok" ? "border-emerald-200" :
            toast.kind === "warn" ? "border-amber-200" :
            toast.kind === "err" ? "border-rose-200" : "border-slate-200"
          ].join(" ")}
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}

/* --- small components --- */
function SortBtn({ label, active, dir, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={`Sort by ${label}`}
      className={[
        "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm",
        active ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
      ].join(" ")}
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
        <path
          d={dir === "asc" ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"}
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function SkeletonRows({ cols = 6 }) {
  const rows = Array.from({ length: 6 });
  return (
    <>
      {rows.map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-3 py-3">
              <div className="h-3 w-full rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso || "—";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso || "—";
  }
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none">
      <path d="M6.5 3h3l1.5 4-2 1c.8 1.8 2.2 3.2 4 4l1-2 4 1.5v3c0 .6-.4 1-1 1A13 13 0 0 1 5.5 7c0-.6.4-1 1-1Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Loader() {
  return (
    <svg width="16" height="16" viewBox="0 0 38 38" stroke="currentColor" aria-hidden>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".2" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.8s" repeatCount="indefinite"/>
          </path>
        </g>
      </g>
    </svg>
  );
}
