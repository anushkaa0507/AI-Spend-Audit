"use client";

import { useState } from "react";
import Spinner from "@/src/components/UI/Spinner";
import Toast from "@/src/components/UI/Toast";

export default function LeadCapture({ auditId }: { auditId: string }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({ email: "", company: "", role: "", teamSize: 1 });

  async function saveLead() {
    try {
      setLoading(true);
      const response = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, ...formData }),
      });
      const data = await response.json();
      if (data.success) {
        setToast({ message: "Your full report is on its way!", type: "success" });
      } else {
        setToast({ message: "Something went wrong. Please try again.", type: "error" });
      }
    } catch (error) {
      console.log(error);
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    }
    setLoading(false);
  }

  return (
    <>
     

      <div
        className="lc-wrap max-w-4xl mx-auto px-4 pb-24"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            background: "rgba(18,14,32,0.85)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 24,
            padding: "clamp(24px,6vw,40px)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Corner glow */}
          <div
            className="absolute pointer-events-none"
            style={{ top: -50, right: -50, width: 180, height: 180, background: "rgba(139,92,246,0.1)", filter: "blur(60px)", borderRadius: "50%" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4h12v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="#c4b5fd" strokeWidth="1.4" />
                  <path d="M3 4l6 6 6-6" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <h2
                className="font-black"
                style={{ color: "#e9ddff", fontSize: "clamp(1.2rem,3vw,1.5rem)", letterSpacing: "-0.02em" }}
              >
                Get Your Full Report
              </h2>
            </div>
            <p style={{ color: "rgba(203,196,210,0.5)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Unlock detailed breakdowns, peer benchmarks, and a custom savings roadmap.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="lc-label">Work Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="lc-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="lc-label">Company</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className="lc-input"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <label className="lc-label">Your Role</label>
                <input
                  type="text"
                  placeholder="CTO, Head of AI, etc."
                  className="lc-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            <button onClick={saveLead} disabled={loading} className="lc-btn mt-6">
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Sending Report…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8l5 5L14 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Get Full Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}