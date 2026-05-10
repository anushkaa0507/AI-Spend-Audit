"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/UI/Spinner";
import Toast from "@/src/components/UI/Toast";

interface Tool {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

const TOOL_OPTIONS = ["ChatGPT", "Claude", "GitHub Copilot", "Midjourney", "Anthropic API", "Gemini", "Perplexity"];
const PLAN_OPTIONS = ["Team", "Plus", "Enterprise", "Pro", "Business", "Individual"];
const USE_CASES = [
  { value: "coding",   label: "Software Development & Engineering" },
  { value: "support",  label: "Customer Support Automation" },
  { value: "content",  label: "Content & Marketing Ops" },
  { value: "data",     label: "Internal Data Analysis" },
];

export default function SpendForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [formData, setFormData] = useState({
    teamSize: 2,
    primaryUseCase: "coding",
    tools: [{ name: "ChatGPT", plan: "Team", monthlySpend: 60, seats: 2 }] as Tool[],
  });

  const updateTool = (index: number, field: keyof Tool, value: string | number) => {
    const updated = formData.tools.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    setFormData({ ...formData, tools: updated });
  };

  const addTool = () => {
    setFormData({
      ...formData,
      tools: [...formData.tools, { name: "ChatGPT", plan: "Team", monthlySpend: 0, seats: 1 }],
    });
  };

  const removeTool = (index: number) => {
    if (formData.tools.length === 1) return;
    setFormData({ ...formData, tools: formData.tools.filter((_, i) => i !== index) });
  };

  async function runAudit() {
    try {
      setLoading(true);
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        router.push(`/results/${data.id}`);
      } else {
        setToast({ message: "Audit failed. Please try again.", type: "error" });
      }
    } catch (error) {
      console.log(error);
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    }
    setLoading(false);
  }

  return (
    <>
     

      <section id="audit" className="py-24 px-6 md:px-12" style={{ background: "linear-gradient(to bottom, #09090f, #0d0b18)" }}>
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 form-section">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Free Analysis
            </div>
            <h2
              className="text-white font-black mb-3"
              style={{ fontFamily: "ui-monospace, 'Cascadia Code', monospace", fontSize: "clamp(2rem,5vw,2.8rem)", letterSpacing: "-0.04em" }}
            >
              Calculate Your Optimization Score
            </h2>
            <p style={{ color: "rgba(203,196,210,0.55)", fontSize: 16 }}>
              The more precise your data, the more savings we can find.
            </p>
          </div>

          {/* Card */}
          <div
            className="form-section relative overflow-hidden"
            style={{
              background: "rgba(18,14,32,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "clamp(24px, 6vw, 48px)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              animationDelay: "0.15s",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute pointer-events-none"
              style={{ top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(139,92,246,0.12)", filter: "blur(60px)" }}
            />

            <div className="relative z-10 flex flex-col gap-6">
              {/* Team Size + Use Case */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Team Size</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 10"
                    className="form-input"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label">Primary Use Case</label>
                  <select
                    className="form-input"
                    value={formData.primaryUseCase}
                    onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value })}
                  >
                    {USE_CASES.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tools */}
              <div className="flex flex-col gap-4">
                <label className="form-label" style={{ marginBottom: 0 }}>Tools to Audit</label>
                {formData.tools.map((tool, idx) => (
                  <div key={idx} className="tool-card">
                    {formData.tools.length > 1 && (
                      <button
                        onClick={() => removeTool(idx)}
                        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                        style={{ color: "rgba(203,196,210,0.4)", background: "rgba(255,255,255,0.05)", fontSize: 16, lineHeight: 1 }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = "#f87171";
                          (e.target as HTMLElement).style.background = "rgba(248,113,113,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = "rgba(203,196,210,0.4)";
                          (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                        }}
                      >
                        ×
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Tool Name</label>
                        <select
                          className="form-input"
                          value={tool.name}
                          onChange={(e) => updateTool(idx, "name", e.target.value)}
                        >
                          {TOOL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Plan Level</label>
                        <select
                          className="form-input"
                          value={tool.plan}
                          onChange={(e) => updateTool(idx, "plan", e.target.value)}
                        >
                          {PLAN_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Monthly Spend</label>
                        <div className="relative">
                          <span className="input-prefix">$</span>
                          <input
                            type="number"
                            min={0}
                            placeholder="0.00"
                            className="form-input"
                            style={{ paddingLeft: 28 }}
                            value={tool.monthlySpend}
                            onChange={(e) => updateTool(idx, "monthlySpend", Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Seats</label>
                        <input
                          type="number"
                          min={1}
                          placeholder="e.g. 5"
                          className="form-input"
                          value={tool.seats}
                          onChange={(e) => updateTool(idx, "seats", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add tool */}
                <button onClick={addTool} className="btn-add">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Add Another Tool
                </button>
              </div>

              {/* Submit */}
              <button onClick={runAudit} disabled={loading} className="btn-submit mt-2">
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Analyzing Your Stack…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 2l2.5 4.5H16l-3.5 3 1.5 5L9 12l-5 2.5 1.5-5L2 6.5h4.5L9 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    Run Full Efficiency Audit
                  </>
                )}
              </button>

              <p className="text-center" style={{ color: "rgba(203,196,210,0.35)", fontSize: 12 }}>
                No credit card required · Free for up to 5 tools
              </p>
            </div>
          </div>
        </div>
      </section>

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