"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(9,9,15,0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6 flex items-center justify-between"
        style={{ height: 60 }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 900,
            fontSize: 18,
            color: "#e9ddff",
            textDecoration: "none",
            letterSpacing: "-0.03em",
            fontFamily: "ui-monospace, 'Cascadia Code', monospace",
          }}
        >
          AI Spend Audit
        </Link>

        <Link
          href="/#audit"
          style={{
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 10,
            padding: "8px 16px",
            color: "#c4b5fd",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Run Audit →
        </Link>
      </div>
    </nav>
  );
}