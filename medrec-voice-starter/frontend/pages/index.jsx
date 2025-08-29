// pages/index.jsx
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // spotlight cursor in hero
  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      root.style.setProperty("--mx", `${x}%`);
      root.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <main className="page">
      {/* NAV — now floating + transparent */}
      <header className="nav">
        <div className="navInner">
          <Link href="/" className="brand">
            <span className="logo">✺</span>
            <span>MedRec Voice</span>
          </Link>
          <nav className="links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <Link href="/patients" className="btn small ghostLight">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="overlay" />
        <div className="content">
          <span className="badge">MedRec Voice</span>
          <h1 id="hero-title" className="headline">
            AI Scribe <span className="amp">&</span> Patient Translator
          </h1>
          <p className="tagline">
            Post-op patient outreach — fast, reliable, and human.
            Turn one conversation into <strong>doctor notes</strong>, a{" "}
            <strong>patient summary</strong>, and{" "}
            <strong>reception tasks</strong>.
          </p>
          <div className="ctaRow">
            <Link href="/patients" className="btn primary shine">View Patients</Link>
            <Link href="/encounters/new" className="btn ghost">Start Voice Encounter</Link>
          </div>
          <div className="trust"><span className="dot" /> HIPAA-ready • Multi-lingual • Real-time notes</div>
        </div>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </section>

      {/* CURVED DIVIDER (smooth transition into features) */}
      <div className="curve" aria-hidden>
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path d="M0,60 C280,140 520,0 720,60 C920,120 1160,40 1440,100 L1440,140 L0,140 Z" />
        </svg>
      </div>

      {/* FEATURES CANVAS (lighter, organic) */}
      <section id="features" className="featuresCanvas">
        <div className="cards">
          <Link href="/patients" className="card fade1">
            <div className="icon">👩‍⚕️</div>
            <h3>Patients</h3>
            <p>Manage your post-op list, sort by procedure date, and start automated check-ins.</p>
            <span className="link">Go to Patients →</span>
          </Link>

          <Link href="/encounters/new" className="card fade2">
            <div className="icon">🎙️</div>
            <h3>New Voice Encounter</h3>
            <p>Capture a live consult and auto-draft SOAP notes in seconds.</p>
            <span className="link">Start an Encounter →</span>
          </Link>

          <Link href="/about" className="card fade3">
            <div className="icon">⚙️</div>
            <h3>How it Works</h3>
            <p>Scribe + translator pipeline: STT → diarize → LLM → tasks → TTS.</p>
            <span className="link">See the pipeline →</span>
          </Link>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats">
        <div className="stat"><div className="num">3×</div><div className="label">Faster Note-taking</div></div>
        <div className="sep" />
        <div className="stat"><div className="num">98%</div><div className="label">Patient Clarity</div></div>
        <div className="sep" />
        <div className="stat"><div className="num">1→3</div><div className="label">Outputs per Visit</div></div>
      </section>

      {/* CTA + WAVE */}
      <section id="how" className="ctaSection">
        <div className="inner">
          <h2>Ready to try the scribe + translator?</h2>
          <p>Spin up a demo encounter or browse your patient list.</p>
          <div className="ctaRow">
            <Link href="/encounters/new" className="btn primary shine">Launch Demo</Link>
            <Link href="/patients" className="btn ghost">Go to Patients</Link>
          </div>
        </div>
        <div className="wave" aria-hidden>
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,160 C240,220 420,40 720,120 C1020,200 1200,120 1440,180 L1440,0 L0,0 Z" />
          </svg>
        </div>
      </section>

      {/* ===== STYLES ===== */}
      <style jsx global>{`
        :root{
          --bg:#0b1220; --text:#f7fbff; --muted:#c6d3ea;
          --brand:#6fb1ff; --brand2:#a08bff;
          --card:#0f172aA6; --border:rgba(255,255,255,.14);
          --shadow:0 20px 50px -20px rgba(0,0,0,.45);
          --mx:50%; --my:30%;
        }
        html,body{
          margin:0; padding:0; background:var(--bg); color:var(--text);
          font-family:Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          scroll-behavior:smooth;
        }
        a{ color:inherit; text-decoration:none }
        .btn{
          display:inline-flex; align-items:center; gap:.6rem; border-radius:12px;
          padding:12px 16px; border:1px solid transparent; cursor:pointer; transition:.2s;
        }
        .btn.small{ padding:8px 12px; border-radius:10px; font-weight:600 }
        .btn.primary{ background:linear-gradient(135deg,var(--brand),var(--brand2)); color:#051122; box-shadow:var(--shadow) }
        .btn.primary:hover{ transform:translateY(-1px) }
        .btn.ghost{ border-color:var(--border); background:rgba(255,255,255,.06) }
        .btn.ghost:hover{ background:rgba(255,255,255,.12) }
        .ghostLight{ border-color:rgba(255,255,255,.25); background:rgba(255,255,255,.08); color:#e8f0ff }
        .ghostLight:hover{ background:rgba(255,255,255,.16) }
        .shine{ position:relative; overflow:hidden }
        .shine::after{
          content:""; position:absolute; inset:-200% -40%; transform:rotate(20deg) translateX(-60%);
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
          transition:.45s; pointer-events:none;
        }
        .shine:hover::after{ transform:rotate(20deg) translateX(40%) }
      `}</style>

      <style jsx>{`
        .page{min-height:100vh; display:flex; flex-direction:column}

        /* NAV (floating, transparent) */
        .nav{ position:absolute; top:0; left:0; right:0; z-index:50; background:transparent; }
        .navInner{ max-width:1100px; margin:0 auto; padding:12px 20px;
          display:flex; align-items:center; justify-content:space-between; }
        .brand{ display:flex; align-items:center; gap:10px; font-weight:700 }
        .logo{
          display:grid; place-items:center; width:34px; height:34px; border-radius:10px;
          background:linear-gradient(135deg,#6ea8ff,#8a7bff); color:#fff; box-shadow:var(--shadow);
          font-weight:900;
        }
        .links{ display:flex; align-items:center; gap:14px; color:#d7e4ff }
        .links a{ color:#d7e4ff; opacity:.85 }
        .links a:hover{ opacity:1 }

        /* HERO */
        .hero{
          position:relative; min-height:80vh; display:grid; place-items:center; overflow:hidden;
          background:
            radial-gradient(900px 600px at var(--mx) var(--my), rgba(126,161,255,.12), transparent 70%),
            linear-gradient(180deg, rgba(5,10,25,.42), rgba(5,10,25,.88)),
            url("/hero.jpg") center/cover no-repeat;
        }
        .overlay{
          position:absolute; inset:-2px;
          background:
            radial-gradient(1200px 600px at 10% 10%, rgba(111,177,255,.25), transparent 70%),
            radial-gradient(1000px 500px at 90% 20%, rgba(160,139,255,.18), transparent 70%);
          mix-blend: screen; animation: float 12s ease-in-out infinite alternate;
        }
        @keyframes float { from{transform:translateY(-6px)} to{transform:translateY(6px)} }

        .content{ position:relative; z-index:2; text-align:center; max-width:980px; padding:72px 20px 46px; }
        .badge{
          display:inline-block; font-size:.85rem; letter-spacing:.04em;
          color:#0f1a33; background:rgba(255,255,255,.92); padding:6px 10px;
          border-radius:999px; margin-bottom:16px; font-weight:600;
        }
        .headline{
          margin:6px 0 10px; line-height:1.06; font-size: clamp(2.6rem, 5.6vw, 4rem);
          background: linear-gradient(135deg,#f7fbff,#d9e6ff);
          -webkit-background-clip:text; background-clip:text; color:transparent;
          text-shadow: 0 10px 30px rgba(0,0,0,.2);
        }
        .amp{
          background: linear-gradient(135deg,var(--brand),var(--brand2));
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .tagline{ max-width:820px; margin:0 auto; color:var(--muted); font-size:1.06rem }
        .ctaRow{ display:flex; gap:12px; justify-content:center; margin-top:22px }
        .trust{ margin-top:18px; color:#bcd6ff; font-size:.9rem; display:flex; gap:8px; justify-content:center; align-items:center; opacity:.9 }
        .dot{ width:6px; height:6px; border-radius:50%; background:#8ab6ff; display:inline-block }

        /* blobs */
        .blob{ position:absolute; border-radius:50%; filter: blur(50px); opacity:.28; z-index:1; }
        .b1{ width:420px; height:420px; top:8%; left:5%; background:radial-gradient(circle at 30% 30%, #7cc0ff, transparent 60%); animation: drift 18s ease-in-out infinite }
        .b2{ width:420px; height:420px; bottom:-14%; right:2%; background:radial-gradient(circle at 60% 40%, #9a8bff, transparent 60%); animation: drift2 22s ease-in-out infinite }
        .b3{ width:300px; height:300px; bottom:-10%; left:15%; background:radial-gradient(circle at 50% 50%, #1dd1ff, transparent 60%); animation: drift3 26s ease-in-out infinite }
        @keyframes drift { 50%{ transform: translate(30px, 20px) scale(1.05) } }
        @keyframes drift2 { 50%{ transform: translate(-20px, -10px) scale(1.06) } }
        @keyframes drift3 { 50%{ transform: translate(-10px, 18px) scale(1.04) } }

        /* CURVE DIVIDER */
        .curve svg{ display:block; width:100%; height:120px }
        .curve path{ fill:#0c152c } /* slightly lighter than hero to feel organic */

        /* FEATURES CANVAS */
        .featuresCanvas{
          background: radial-gradient(800px 500px at 20% 0%, rgba(64,96,160,.12), transparent 60%),
                      radial-gradient(700px 400px at 80% 20%, rgba(160,96,255,.10), transparent 60%),
                      linear-gradient(180deg,#0c152c,#0a132a 40%);
          padding: 26px 0 10px;
        }

        /* CARDS */
        .cards{
          display:grid; grid-template-columns:repeat(3, minmax(0,1fr));
          gap:18px; max-width:1100px; margin:0 auto; padding:0 20px 28px;
        }
        .card{
          background: linear-gradient(180deg, rgba(17,26,47,.7), rgba(17,26,47,.6));
          backdrop-filter: blur(10px);
          border:1px solid var(--border); border-radius:16px;
          padding:18px 18px 16px; box-shadow: 0 20px 40px -24px rgba(0,0,0,.55);
          transform: translateY(0); transition: transform .25s, box-shadow .25s, border-color .25s, background .25s;
        }
        .card:hover{ transform: translateY(-6px); border-color:#28406b8a; background:rgba(20,32,62,.78) }
        .icon{ font-size:26px; margin-bottom:8px }
        h3{ margin:2px 0 6px; font-size:1.12rem }
        .card p{ color:var(--muted); margin:0 0 10px; line-height:1.45 }
        .link{ color:#bcd6ff }

        .fade1{ animation: fadeUp .7s ease both .12s }
        .fade2{ animation: fadeUp .7s ease both .22s }
        .fade3{ animation: fadeUp .7s ease both .32s }
        @keyframes fadeUp { from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:translateY(0)} }

        /* STATS */
        .stats{
          max-width:1000px; margin:18px auto 10px; padding:10px 16px;
          display:flex; align-items:center; justify-content:center; gap:22px;
          color:#c9daf8; opacity:.95;
        }
        .stat{ text-align:center }
        .num{ font-weight:800; font-size:1.35rem }
        .label{ font-size:.9rem; color:#9fb6e6 }
        .sep{ width:1px; height:26px; background:rgba(255,255,255,.1) }

        /* CTA + WAVE */
        .ctaSection{ position:relative; margin-top:10px; background:linear-gradient(180deg,#0a132a,#0a132a) }
        .ctaSection .inner{ max-width:980px; margin:0 auto; padding:34px 20px 8px; text-align:center }
        .ctaSection p{ color:var(--muted); margin:0 0 12px }
        .wave{ margin-top:18px; opacity:.45 }
        .wave svg{ display:block; width:100%; height:140px }
        .wave path{ fill:#0a132a }

        @media (max-width: 920px){
          .cards{ grid-template-columns:1fr }
          .sep{ display:none }
        }
      `}</style>
    </main>
  );
}
