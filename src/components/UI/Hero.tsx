"use client";

import { useEffect, useRef, useState } from "react";

const DEMO_STEPS = [
  {
    label: "1 · Enter your tools",
    icon: "⚙️",
    color: "#7c3aed",
    content: (
      <div className="demo-form-step">
        <div className="demo-field">
          <span className="demo-field-label">Primary Tool</span>
          <div className="demo-field-val typing">
            ChatGPT Enterprise<span className="cursor">|</span>
          </div>
        </div>
        <div className="demo-field">
          <span className="demo-field-label">Monthly Spend</span>
          <div className="demo-field-val typing-2">
            $4,<span className="typing-3">200</span>
            <span className="cursor">|</span>
          </div>
        </div>
        <div className="demo-field">
          <span className="demo-field-label">Team Size</span>
          <div className="demo-field-val typing-4">
            48 seats<span className="cursor">|</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "2 · AI scans your stack",
    icon: "🔍",
    color: "#a855f7",
    content: (
      <div className="demo-scan-step">
        <div className="scan-bar-wrap">
          {[
            "Analysing usage patterns…",
            "Comparing 340 vendor plans…",
            "Detecting redundant seats…",
            "Benchmarking against peers…",
          ].map((t, i) => (
            <div
              key={t}
              className="scan-row"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <span className="scan-check">✓</span>
              <span className="scan-text">{t}</span>
            </div>
          ))}
        </div>
        <div className="scan-progress-outer">
          <div className="scan-progress-inner" />
        </div>
      </div>
    ),
  },
  {
    label: "3 · Savings unlocked",
    icon: "💰",
    color: "#10b981",
    content: (
      <div className="demo-results-step">
        <div className="result-hero">
          <span className="result-label">Monthly Savings</span>
          <span className="result-amount counter">$1,340</span>
          <span className="result-sub">↑ 32% reduction identified</span>
        </div>
        <div className="result-bars">
          {[
            { tool: "ChatGPT", pct: 72, save: "$680" },
            { tool: "GitHub Copilot", pct: 45, save: "$420" },
            { tool: "Midjourney", pct: 28, save: "$240" },
          ].map((r) => (
            <div key={r.tool} className="result-bar-row">
              <span className="result-bar-tool">{r.tool}</span>
              <div className="result-bar-track">
                <div
                  className="result-bar-fill"
                  style={{ width: `${r.pct}%` }}
                />
              </div>
              <span className="result-bar-save">{r.save}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      o: Math.random() * 0.45 + 0.08,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > c.width) d.vx *= -1;
        if (d.y < 0 || d.y > c.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${d.o})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++)
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x,
            dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.11 * (1 - dist / 95)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}
export default function Hero() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(
      () => setStep((s) => (s + 1) % DEMO_STEPS.length),
      3200,
    );
    return () => clearTimeout(t);
  }, [step, playing]);
  return (
    <>
      <section className="hero-section" id="home">
        <ParticleCanvas />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "15%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(124,58,237,.08)",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "12%",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(168,85,247,.07)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 800,
            width: "100%",
          }}
        >
          <div className="hero-badge">
            <span className="badge-dot" />
            AI Stack Optimization Engine v2.0 — Now Live
          </div>

          <h1 className="hero-h1">
            Stop Overspending
            <br />
            on <span className="grad">AI Tools</span>
          </h1>

          <p className="hero-sub">
            Instantly analyze your AI stack, uncover hidden savings, and
            optimize your monthly spend — in under 60 seconds. No credit card
            needed.
          </p>

          <div className="hero-btns">
            <button
              className="btn-hero-primary"
              onClick={() =>
                document
                  .getElementById("audit")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Run Free Audit →
            </button>
            <button
              className="btn-hero-ghost"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See How It Works
            </button>
          </div>

          <div className="hero-stats">
            {[
              { val: "-22%", label: "Avg. Spend Reduction" },
              { val: "12,400+", label: "Audits Performed" },
              { val: "$4.2M", label: "Savings Identified" },
            ].map((s) => (
              <div key={s.val} style={{ textAlign: "center" }}>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="demo-wrap">
            <div className="demo-halo" />
            <div className="demo-window">
              {/* Title bar */}
              <div className="demo-titlebar">
                <div className="demo-dot" style={{ background: "#ff5f56" }} />
                <div className="demo-dot" style={{ background: "#ffbd2e" }} />
                <div className="demo-dot" style={{ background: "#27c93f" }} />
                <span className="demo-title-text">Credex — Live Demo</span>
                {/* Play/Pause */}
                <button
                  onClick={() => setPlaying(!playing)}
                  style={{
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 6,
                    padding: "3px 10px",
                    color: "rgba(203,196,210,.5)",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                >
                  {playing ? "⏸" : "▶"}
                </button>
              </div>
              <div className="demo-tabs">
                {DEMO_STEPS.map((s, i) => (
                  <button
                    key={i}
                    className={`demo-tab ${step === i ? "active" : ""}`}
                    onClick={() => {
                      setStep(i);
                      setPlaying(false);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="demo-body">
                <div key={step} className="demo-step-content">
                  {DEMO_STEPS[step].content}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(255,255,255,.05)",
                }}
              >
                {DEMO_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setStep(i);
                      setPlaying(false);
                    }}
                    style={{
                      width: step === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background:
                        step === i
                          ? "linear-gradient(90deg,#7c3aed,#a855f7)"
                          : "rgba(255,255,255,.12)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all .35s cubic-bezier(.22,1,.36,1)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="scroll-cue"
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.28,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: ".1em",
              color: "#c4b5fd",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 6l5 5 5-5"
              stroke="#c4b5fd"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>
      <section
        id="features"
        style={{
          padding: "100px 24px",
          background: "linear-gradient(to bottom,#09090f,#0d0b18)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="pill-tag">Features</div>
            <h2 className="section-title">
              Everything you need to
              <br />
              slash AI spend
            </h2>
            <p
              className="section-sub"
              style={{ marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}
            >
              Built for CTOs, engineering leads, and finance teams who want
              clarity over cost.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: "🔍",
                title: "Stack Scanner",
                desc: "Automatically detect every AI tool in use across your org — even shadow IT subscriptions.",
              },
              {
                icon: "💸",
                title: "Spend Intelligence",
                desc: "See real unit economics: cost per token, per seat, per task. Compare against 340+ vendor plans.",
              },
              {
                icon: "🪄",
                title: "AI Recommendations",
                desc: "Get a prioritized savings roadmap generated by our model, benchmarked against similar teams.",
              },
              {
                icon: "📊",
                title: "Usage Analytics",
                desc: "Heatmaps and trend charts show exactly when, how, and who uses each tool across your team.",
              },
              {
                icon: "🔔",
                title: "Price Alerts",
                desc: "Get notified the moment a cheaper plan or vendor credit becomes available for tools you use.",
              },
              {
                icon: "🔐",
                title: "Enterprise Security",
                desc: "SOC 2 Type II. No data leaves your environment. Audit-ready reports on demand.",
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3
                  style={{
                    color: "#e9ddff",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 8,
                    letterSpacing: "-.02em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "rgba(203,196,210,.55)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="how-it-works"
        style={{ padding: "100px 24px", background: "#09090f" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="pill-tag">How It Works</div>
            <h2 className="section-title">
              From input to savings
              <br />
              in 60 seconds
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                n: "01",
                title: "Enter Your Stack",
                desc: "Tell us which AI tools you're paying for, your plan level, team size, and monthly spend.",
              },
              {
                n: "02",
                title: "AI Scans & Compares",
                desc: "Our engine benchmarks your usage against 12,400+ audits and 340+ vendor pricing models in real-time.",
              },
              {
                n: "03",
                title: "Get Your Report",
                desc: "A prioritized savings roadmap lands instantly — with specific actions and projected ROI for each.",
              },
            ].map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <h3
                  style={{
                    color: "#e9ddff",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 10,
                    letterSpacing: "-.02em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(203,196,210,.55)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 56, textAlign: "center" }}>
            <button
              className="btn-hero-primary"
              onClick={() =>
                document
                  .getElementById("audit")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{ fontSize: 16, padding: "16px 40px" }}
            >
              Start Your Free Audit →
            </button>
            <p
              style={{
                color: "rgba(203,196,210,.35)",
                fontSize: 12,
                marginTop: 12,
              }}
            >
              No credit card · Free for up to 5 tools
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
