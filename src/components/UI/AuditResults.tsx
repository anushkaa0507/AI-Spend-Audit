type Recommendation = {
  tool: string;
  recommendation: string;
  savings: number;
  reason: string;
};

type AuditResultsProps = {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: Recommendation[];
  summary: string;
};

export default function AuditResults({
  totalMonthlySavings,
  totalAnnualSavings,
  recommendations,
  summary,
}: AuditResultsProps) {
  const highSavings = totalMonthlySavings > 500;

  return (
    <section className="max-w-5xl mx-auto mt-10 px-4">
      {/* HERO CARD */}

      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Potential Savings
        </p>

        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
            <p className="text-zinc-400 text-sm">Monthly Savings</p>

            <h2 className="text-5xl font-bold text-green-400 mt-2">
              ${totalMonthlySavings}
            </h2>
          </div>

          <div className="rounded-2xl bg-black/40 border border-white/10 p-6">
            <p className="text-zinc-400 text-sm">Annual Savings</p>

            <h2 className="text-5xl font-bold text-green-400 mt-2">
              ${totalAnnualSavings}
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-white mb-6">
          Optimization Recommendations
        </h2>

        <div className="grid gap-5">
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-6"
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-zinc-400 text-sm">Tool</p>
                  <h3 className="text-2xl font-semibold text-white mt-1">
                    {item.tool}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-sm">Potential Savings</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">
                    ${item.savings}/mo
                  </h3>
                </div>
              </div>

              <div className="mt-6">
                <div className="inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-4 py-2 text-green-400 text-sm">
                  {item.recommendation}
                </div>
              </div>
              <p className="text-zinc-300 mt-5 leading-7">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8">
        <p className="text-sm uppercase tracking-widest text-purple-300">
          AI Generated Summary
        </p>
        <p className="text-zinc-200 text-lg leading-8 mt-4">{summary}</p>
      </div>
      {highSavings && (
        <div className="mt-10 rounded-3xl border border-green-500/20 bg-green-500/5 p-8">
          <h2 className="text-3xl font-bold text-white">
            You Could Save Over $500/Month
          </h2>

          <p className="text-zinc-300 mt-3 text-lg">
            Credex can help optimize your AI infrastructure, vendor credits, and
            enterprise pricing strategy.
          </p>

          <button className="mt-6 bg-green-500 hover:bg-green-400 transition text-black font-semibold px-6 py-3 rounded-xl">
            Book Credex Consultation
          </button>
        </div>
      )}

      {/* LOW SAVINGS MESSAGE */}

      {!highSavings && totalMonthlySavings < 100 && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900 p-8">
          <h2 className="text-2xl font-bold text-white">
            Your Stack Looks Healthy
          </h2>

          <p className="text-zinc-300 mt-3">
            You’re already spending efficiently. We’ll notify you when better
            pricing or optimization opportunities become available.
          </p>
        </div>
      )}
    </section>
  );
}
