'use client';
import { useEffect, useMemo, useState } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const N8N_FALLBACK = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

export default function Home() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  // sorting
  const [sortKey, setSortKey] = useState('procedure_date'); // 'patient_id' | 'first' | 'last' | 'dob' | 'procedure_date'
  const [sortDir, setSortDir] = useState('desc');           // 'asc' | 'desc'

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${BACKEND}/api/patients`, { cache: 'no-store' });
        const j = await r.json();
        setRows(Array.isArray(j.items) ? j.items : []);
      } catch (e) {
        setToast({ kind: 'err', msg: `Failed to load patients: ${e.message}` });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = useMemo(() => {
    const s = [...rows].sort((a, b) => {
      const av = (a[sortKey] ?? '').toString();
      const bv = (b[sortKey] ?? '').toString();
      if (sortKey === 'dob' || sortKey === 'procedure_date') {
        const ad = new Date(av).getTime() || 0;
        const bd = new Date(bv).getTime() || 0;
        return sortDir === 'asc' ? ad - bd : bd - ad;
      }
      const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base', numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return s;
  }, [rows, sortKey, sortDir]);

  const callPatient = async (p) => {
    setBusyId(p.patient_id);
    setToast({ kind: 'info', msg: `Starting call for ${p.first ?? ''} ${p.last ?? ''}…` });
    try {
      const r = await fetch(`${BACKEND}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: p.patient_id }),
      });
      const j = await r.json();
      if (j.ok) setToast({ kind: 'ok', msg: '✅ Sent to n8n. Check workflow executions.' });
      else setToast({ kind: 'warn', msg: `⚠️ Backend responded but not OK: ${j.status}` });
    } catch (e) {
      setToast({ kind: 'err', msg: `❌ ${e.message}` });
    } finally {
      setBusyId(null);
      setTimeout(() => setToast(null), 3200);
    }
  };

  const onSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <main className="page">
      <header className="topbar">
        <div className="container">
          <div className="brand">
            <span className="logo" aria-hidden>✺</span>
            <div>
              <h1>MedRec Voice</h1>
              <p>Post-op patient outreach — fast, reliable, and human.</p>
            </div>
          </div>
          {N8N_FALLBACK ? (
            <button
              className="btn outline"
              onClick={() => {
                const p = sorted[0]; if (!p) return;
                fetch(N8N_FALLBACK, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ source: 'medrec-voice-starter', event: 'start_call', payload: { patient_id: p.patient_id } })
                });
                setToast({ kind: 'ok', msg: '✅ Posted to n8n webhook (fallback).' });
                setTimeout(() => setToast(null), 3000);
              }}
            >
              Test n8n Webhook
            </button>
          ) : null}
        </div>
      </header>

      <section className="container">
        <div className="tableCard">
          <div className="tableHeader">
            <div className="left">
              <h2>Patients</h2>
              <span className="muted">{rows.length} total</span>
            </div>
            <div className="right sorts">
              <SortBtn label="ID" active={sortKey === 'patient_id'} dir={sortDir} onClick={()=>onSort('patient_id')} />
              <SortBtn label="First" active={sortKey === 'first'} dir={sortDir} onClick={()=>onSort('first')} />
              <SortBtn label="Last" active={sortKey === 'last'} dir={sortDir} onClick={()=>onSort('last')} />
              <SortBtn label="DoB" active={sortKey === 'dob'} dir={sortDir} onClick={()=>onSort('dob')} />
              <SortBtn label="Procedure" active={sortKey === 'procedure_date'} dir={sortDir} onClick={()=>onSort('procedure_date')} />
            </div>
          </div>

          <table className="table" role="grid">
            {/* percentage widths so it always fits the viewport */}
            <colgroup>
              <col style={{ width: '16%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '10%' }} /> {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>First</th>
                <th>Last</th>
                <th>DoB</th>
                <th>Procedure Date</th>
                <th className="right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonRows cols={6} />}
              {!loading && sorted.length === 0 && (
                <tr><td colSpan={6} className="empty">No patients.</td></tr>
              )}
              {!loading && sorted.map(p => (
                <tr key={p.patient_id} className="row">
                  <td title={p.patient_id}><span className="chip">{p.patient_id}</span></td>
                  <td className="clip" title={p.first || ''}>{p.first || '—'}</td>
                  <td className="clip" title={p.last || ''}>{p.last || '—'}</td>
                  <td title={p.dob || ''}><span className="pill">{fmtDate(p.dob)}</span></td>
                  <td title={p.procedure_date || ''}><span className="pill">{fmtDate(p.procedure_date)}</span></td>
                  <td className="right">
                    <button
                      className="btn primary sm"
                      onClick={()=>callPatient(p)}
                      disabled={busyId === p.patient_id || !p.phone}
                      title={p.phone ? 'Start call' : 'No phone on file'}
                    >
                      {busyId === p.patient_id ? Loader() : PhoneIcon()} Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {toast && <div className={`toast ${toast.kind}`}>{toast.msg}</div>}

      {/* LIGHT THEME */}
      <style jsx global>{`
        :root{
          --bg:#f7f9fc;
          --text:#0c1220;
          --muted:#5b6b82;
          --brand:#2b77ff;
          --surface:#ffffff;
          --border:#e6ebf2;
          --shadow:0 20px 40px -20px rgba(3,27,78,.15);
          --success:#17b26a;
          --warn:#f79009;
          --err:#e5484d;
        }
        *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
        .container{max-width:1080px;margin:0 auto;padding:20px 20px}
        a{color:inherit}
        button{font:inherit}
      `}</style>

      <style jsx>{`
        .topbar{
          position:sticky;top:0;z-index:20;background:linear-gradient(180deg,#fff,rgba(255,255,255,.88));
          border-bottom:1px solid var(--border); backdrop-filter:saturate(140%) blur(6px);
        }
        .brand{display:flex;align-items:center;gap:14px}
        .logo{display:grid;place-items:center;width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#6ea8ff,#8a7bff);color:#fff;font-weight:900;box-shadow:var(--shadow)}
        .brand h1{margin:0;font-size:1.2rem}
        .brand p{margin:2px 0 0;color:var(--muted)}
        .btn{display:inline-flex;align-items:center;gap:8px;border-radius:10px;padding:10px 14px;cursor:pointer;border:1px solid transparent}
        .btn.sm{padding:8px 12px}
        .btn.outline{background:#fff;border-color:var(--border)}
        .btn.primary{background:linear-gradient(135deg,#4cc9f0,#4895ef);color:#fff;box-shadow:var(--shadow)}
        .tableCard{margin-top:16px;background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow)}
        .tableHeader{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border)}
        .tableHeader .left{display:flex;align-items:center;gap:10px}
        .muted{color:var(--muted)}
        .sorts{display:flex;gap:8px;flex-wrap:wrap}

        /* STATIC TABLE — always fits container */
        .table{
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          table-layout:fixed;     /* enforce % col widths */
        }
        thead th{
          position:sticky; top:0;
          background:#fff; border-bottom:1px solid var(--border);
          text-align:left; font-size:.85rem; color:#334155; padding:10px 12px; z-index:5;
        }
        tbody td{
          padding:10px 12px; border-bottom:1px solid var(--border); vertical-align:middle;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; /* clamp content */
        }
        .row:hover{background:#fafcff}
        .right{text-align:right}

        .chip{display:inline-block;padding:6px 10px;border-radius:999px;background:#eef4ff;border:1px solid #d6e4ff;color:#253b80;font-weight:600;font-size:.86rem}
        .pill{display:inline-block;padding:6px 10px;border-radius:10px;background:#f4f7fb;border:1px solid var(--border)}
        .clip{overflow:hidden;text-overflow:ellipsis}
        .empty{text-align:center;color:var(--muted);padding:18px}

        .toast{position:fixed;bottom:22px;right:22px;padding:12px 16px;border-radius:12px;background:#fff;border:1px solid var(--border);box-shadow:var(--shadow)}
        .toast.ok{border-color:#b8f3d3}
        .toast.warn{border-color:#ffe1b3}
        .toast.err{border-color:#ffc7c7}

        @media (max-width: 720px){
          .container{padding:16px}
          .btn{padding:8px 12px}
          thead th, tbody td{padding:8px 10px}
        }
      `}</style>
    </main>
  );
}

/* --- small components --- */
function SortBtn({ label, active, dir, onClick }) {
  return (
    <button className={`sort ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active} title={`Sort by ${label}`}>
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
        <path d={dir==='asc'?'M7 14l5-5 5 5':'M7 10l5 5 5-5'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <style jsx>{`
        .sort{display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid var(--border);color:#253b80;font-weight:600}
        .sort.active{box-shadow:inset 0 0 0 2px #dbe7ff}
      `}</style>
    </button>
  );
}
function SkeletonRows({ cols = 6 }){
  const rows = Array.from({length:6});
  return (
    <>
      {rows.map((_,i)=>(
        <tr key={i}>
          {Array.from({length:cols}).map((__,j)=>(
            <td key={j}><div className="shimmer"/></td>
          ))}
          <style jsx>{`
            .shimmer{height:14px;border-radius:6px;background:#eef2f7;position:relative;overflow:hidden}
            .shimmer::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,#fff,transparent);animation:sh 1.2s infinite}
            @keyframes sh{100%{transform:translateX(100%)}}
          `}</style>
        </tr>
      ))}
    </>
  );
}
function fmtDate(iso){
  try{
    const d = new Date(iso);
    if(Number.isNaN(d.getTime())) return iso || '—';
    return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  }catch{return iso || '—'}
}
function PhoneIcon(){
  return (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none"><path d="M6.5 3h3l1.5 4-2 1c.8 1.8 2.2 3.2 4 4l1-2 4 1.5v3c0 .6-.4 1-1 1A13 13 0 0 1 5.5 7c0-.6.4-1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}
function Loader(){
  return (<svg width="16" height="16" viewBox="0 0 38 38" stroke="currentColor" aria-hidden><g fill="none" fillRule="evenodd"><g transform="translate(1 1)" strokeWidth="2"><circle strokeOpacity=".2" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.8s" repeatCount="indefinite"/></path></g></g></svg>);
}
