import { supabase } from "@/lib/supabase";

import LeadCapture from "@/src/components/UI/LeadCapture";
import AuditResults from "@/src/components/UI/AuditResults";
import Navbar from "@/src/components/UI/Navbar";

async function getAudit(id: string) {
  console.log("========== GET AUDIT ==========");
  console.log("Incoming ID:", id);

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);

  if (error) {
    console.log("RETURNING NULL");
    return null;
  }

  console.log("RETURNING DATA");

  return data;
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // IMPORTANT
  const resolvedParams = await params;

  // ONLY use resolvedParams
  const id = resolvedParams.id;

  console.log("Resolved ID:", id);

  const audit = await getAudit(id);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #09090f 0%, #0d0b18 40%, #09090f 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Navbar />

      <div className="pt-24">
        {!audit ? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
            style={{
              color: "rgba(203,196,210,0.5)",
            }}
          >
            <p
              style={{
                fontSize: 22,
                color: "#fff",
              }}
            >
              Audit not found
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 2.8rem)",
                  fontWeight: 900,
                  color: "#e9ddff",
                }}
              >
                Your AI Spend Audit
              </h1>
            </div>

            <AuditResults
              auditId={audit.id}
              totalMonthlySavings={audit.total_monthly_savings}
              totalAnnualSavings={audit.total_annual_savings}
              recommendations={audit.results ?? []}
              summary={audit.ai_summary ?? ""}
            />

            <LeadCapture auditId={audit.id} />
          </>
        )}
      </div>
    </main>
  );
}