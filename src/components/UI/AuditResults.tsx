"use client";

import { useState } from "react";

type Recommendation = {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
};

type AuditResultsProps = {
  auditId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: Recommendation[];
  summary: string;
};

export default function AuditResults({
  auditId,
  totalMonthlySavings,
  totalAnnualSavings,
  recommendations,
  summary,
}: AuditResultsProps) {
  const highSavings = totalMonthlySavings > 500;
  const alreadyOptimal = totalMonthlySavings < 100;
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/results/${auditId}`
      : `/results/${auditId}`;

  function handleShare() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="max-w-5xl mx-auto mt-10 px-4">
      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <p className="text-sm uppercase tracking-widest text-zinc-400">Potential Savings</p>
          <button
            onClick={handleShare}
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 10,
              padding: "8px 16px",
              color: "#c4b5fd",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 1l4 4-4 4M13 5H5a4 4 0 000 8" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {copied ? "Link Copied!" : "Share Report"}
          </button>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
            <p className="text-zinc-400 text-sm">Monthly Savings</p>
            <h2 className="text-5xl font-bold text-green-400 mt-2">
              ${totalMonthlySavings.toLocaleString()}
            </h2>
          </div>
          <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
            <p className="text-zinc-400 text-sm">Annual Savings</p>
            <h2 className="text-5xl font-bold text-green-400 mt-2">
              ${totalAnnualSavings.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold text-white mb-6">Optimization Recommendations</h2>
        <div className="grid gap-5">
          {recommendations.map((item, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-zinc-400 text-sm">Tool</p>
                  <h3 className="text-2xl font-semibold text-white mt-1">{item.tool}</h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    Current: {item.currentPlan} · ${item.currentSpend}/mo
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-sm">Potential Savings</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">
                    ${item.savings.toLocaleString()}/mo
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    ${(item.savings * 12).toLocaleString()}/yr
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm"
                  style={{
                    background: item.savings > 0 ? "rgba(74,222,128,0.1)" : "rgba(139,92,246,0.1)",
                    border: item.savings > 0 ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(139,92,246,0.2)",
                    color: item.savings > 0 ? "#4ade80" : "#c4b5fd",
                  }}
                >
                  {item.recommendedAction}
                </div>
              </div>
              <p className="text-zinc-300 mt-5 leading-7">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8">
        <p className="text-sm uppercase tracking-widest text-purple-300">AI-Generated Summary</p>
        <p className="text-zinc-200 text-lg leading-8 mt-4">{summary}</p>
      </div>

      {highSavings && (
        <div className="mt-10 rounded-3xl border border-green-500/20 bg-green-500/5 p-8">
          <h2 className="text-3xl font-bold text-white">You Could Save Over $500/Month</h2>
          <p className="text-zinc-300 mt-3 text-lg">
            Credex specializes in AI vendor negotiations, enterprise pricing strategy, and credit optimization. Our average client captures 30-40% beyond what self-service audits identify.
          </p>
          <a
            href="https://credex.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-green-500 hover:bg-green-400 transition text-black font-semibold px-6 py-3 rounded-xl"
          >
            Book Credex Consultation →
          </a>
        </div>
      )}

      {alreadyOptimal && totalMonthlySavings === 0 && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900 p-8">
          <h2 className="text-2xl font-bold text-white">Your Stack Looks Healthy 🎉</h2>
          <p className="text-zinc-300 mt-3">
            You're already spending efficiently. We'll notify you when better pricing or optimization opportunities become available for your stack.
          </p>
        </div>
      )}
    </section>
  );
}