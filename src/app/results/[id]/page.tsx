import LeadCapture from "@/src/components/UI/LeadCapture";
import AuditResults from "@/src/components/UI/AuditResults";
import Navbar from "@/src/components/UI/Navbar";
async function getAudit(id: string) {
  const response = await fetch(`http://localhost:3000/api/results/${id}`, {
    cache: "no-store",
  });
  return response.json();
}
export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAudit(id);
  const audit = result.data;
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #09090f 0%, #0d0b18 40%, #09090f 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Navbar />
      <div className="pt-24">
        {!audit ? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
            style={{ color: "rgba(203,196,210,0.5)" }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="11" stroke="#a78bfa" strokeWidth="1.5" />
                <path d="M14 10v5M14 18v1" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontSize: 17, color: "#e9ddff", fontWeight: 600 }}>Audit not found</p>
            <p style={{ fontSize: 14 }}>The audit ID may be invalid or expired.</p>
            <a
              href="/"
              style={{
                marginTop: 8,
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                color: "white",
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              ← Run New Audit
            </a>
          </div>
        ) : (
          <>
                      <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  color: "#6ee7b7",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#6ee7b7",
                    display: "inline-block",
                    boxShadow: "0 0 6px #6ee7b7",
                  }}
                />
                Audit Complete
              </div>
              <h1
                style={{
                  fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                  fontSize: "clamp(2rem, 5vw, 2.8rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#e9ddff",
                  lineHeight: 1.1,
                }}
              >
                Your AI Spend Audit
              </h1>
            </div>

            <AuditResults
              totalMonthlySavings={audit.total_monthly_savings}
              totalAnnualSavings={audit.total_annual_savings}
              recommendations={audit.recommendations ?? []}
              summary={audit.ai_summary ?? ""}
            />

            <LeadCapture auditId={audit.id} />
          </>
        )}
      </div>
    </main>
  );
}