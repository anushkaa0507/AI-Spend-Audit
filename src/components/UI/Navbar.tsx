"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const isResultsPage = pathname?.startsWith("/results");

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ["features", "how-it-works", "audit"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Run Audit", id: "audit" },
  ];

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes backPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.3); }
          50%       { box-shadow: 0 0 0 8px rgba(139,92,246,0); }
        }
        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(139,92,246,0.4); }
          50%       { box-shadow: 0 0 22px rgba(168,85,247,0.7); }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-10px) scaleY(0.96); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }

        .navbar-root {
          animation: navSlideDown 0.6s cubic-bezier(.22,1,.36,1) both;
        }
        .logo-text {
          background: linear-gradient(90deg, #c4b5fd 0%, #fff 42%, #a78bfa 68%, #c4b5fd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: logoShimmer 4s linear infinite;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.04em;
        }

        .header-glass {
          transition: background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
          border-bottom: 1px solid transparent;
        }
        .header-glass.scrolled {
          background: rgba(9,9,15,0.88) !important;
          border-bottom-color: rgba(255,255,255,0.055) !important;
          box-shadow: 0 8px 48px rgba(0,0,0,0.5) !important;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        /* Nav links */
        .nav-link {
          position: relative;
          color: rgba(203,196,210,0.55);
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          padding: 6px 2px;
          transition: color 0.22s;
          cursor: pointer;
          background: none;
          border: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 1px; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, #a78bfa, #7c3aed);
          border-radius: 1px;
          transition: width 0.35s cubic-bezier(.22,1,.36,1);
        }
        .nav-link:hover,
        .nav-link.active { color: #e9ddff; }
        .nav-link.active::after,
        .nav-link:hover::after { width: 100%; }

        /* Active dot */
        .nav-link.active::before {
          content: '';
          position: absolute;
          bottom: -6px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px #a78bfa;
          opacity: 1;
        }

        /* CTA */
        .btn-nav-cta {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 9px 20px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 0 18px rgba(139,92,246,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
          white-space: nowrap;
        }
        .btn-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 36px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-nav-cta:active { transform: scale(0.96); }

        /* Back button */
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(139,92,246,0.09);
          border: 1px solid rgba(139,92,246,0.28);
          color: #c4b5fd;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 8px 18px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(.22,1,.36,1);
          animation: backPulse 3.5s ease-in-out infinite;
        }
        .btn-back:hover {
          background: rgba(139,92,246,0.18);
          border-color: rgba(139,92,246,0.55);
          color: #e9ddff;
          transform: translateX(-3px);
          box-shadow: 4px 0 20px rgba(139,92,246,0.15);
        }
        .btn-back:active { transform: translateX(-1px) scale(0.97); }
        .btn-back .back-arrow {
          transition: transform 0.28s cubic-bezier(.22,1,.36,1);
        }
        .btn-back:hover .back-arrow { transform: translateX(-3px); }

        /* Logo icon */
        .logo-icon {
          animation: iconGlow 3s ease-in-out infinite;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Hamburger */
        .ham-bar {
          display: block;
          width: 20px; height: 1.5px;
          background: #c4b5fd;
          border-radius: 2px;
          transition: all 0.32s cubic-bezier(.22,1,.36,1);
          transform-origin: center;
        }

        /* Mobile panel */
        .mobile-panel {
          animation: mobileMenuIn 0.3s cubic-bezier(.22,1,.36,1) forwards;
          transform-origin: top center;
        }

        /* Mobile nav link */
        .mob-nav-link {
          display: block;
          padding: 13px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(203,196,210,0.65);
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s, padding-left 0.2s;
          cursor: pointer;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          text-align: left;
          width: 100%;
        }
        .mob-nav-link:hover { color: #e9ddff; padding-left: 6px; }
      `}</style>

      <header
        className={`navbar-root fixed top-0 w-full z-50 header-glass ${scrolled ? "scrolled" : ""}`}
        style={{ background: "transparent" }}
      >
        <nav className="max-w-6xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0">
            {isResultsPage && mounted && (
              <button onClick={() => router.push("/")} className="btn-back">
                <svg className="back-arrow" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M8.5 2L4 6.5l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            )}
            <a href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="logo-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5L12.5 4.5V9.5L7 12.5L1.5 9.5V4.5L7 1.5Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
                  <circle cx="7" cy="7" r="1.8" fill="white" />
                </svg>
              </div>
              <span className="logo-text">Credex</span>
            </a>
          </div>

          {/* CENTER — desktop links */}
          {!isResultsPage && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className={`nav-link ${activeSection === l.id ? "active" : ""}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {!isResultsPage && (
              <>
                <button onClick={() => scrollTo("audit")} className="btn-nav-cta hidden md:inline-flex">
                  Run Free Audit
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden flex flex-col justify-center items-center gap-[5.5px] w-9 h-9"
                  aria-label="Toggle menu"
                >
                  <span className="ham-bar" style={{ transform: mobileOpen ? "rotate(45deg) translate(0,7px)" : "none" }} />
                  <span className="ham-bar" style={{ opacity: mobileOpen ? 0 : 1, transform: mobileOpen ? "scaleX(0)" : "none" }} />
                  <span className="ham-bar" style={{ transform: mobileOpen ? "rotate(-45deg) translate(0,-7px)" : "none" }} />
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile dropdown */}
        {mobileOpen && !isResultsPage && (
          <div
            className="mobile-panel md:hidden border-t border-white/[0.05] px-5 py-4 flex flex-col"
            style={{ background: "rgba(9,9,15,0.97)", backdropFilter: "blur(24px)" }}
          >
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="mob-nav-link">
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("audit")}
              className="btn-nav-cta mt-4 w-full"
              style={{ borderRadius: 12, padding: "12px 20px", fontSize: 13 }}
            >
              Run Free Audit
            </button>
          </div>
        )}
      </header>
    </>
  );
}