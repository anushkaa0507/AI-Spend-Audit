import { supabaseServer } from "@/lib/supabase-server";
import { Metadata } from "next";
import LeadCapture from "@/src/components/UI/LeadCapture";
import AuditResults from "@/src/components/UI/AuditResults";
import Navbar from "@/src/components/UI/Navbar";

async function getAudit(id: string) {
  const { data, error } = await supabaseServer
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch audit data:", error);
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const audit = await getAudit(resolvedParams.id);

  if (!audit) {
    return {
      title: "Audit Not Found | AI Spend Audit",
    };
  }

  const monthly = audit.total_monthly_savings ?? 0;
  const annual = audit.total_annual_savings ?? 0;
  const title =
    monthly > 0
      ? `I could save $${monthly}/mo on AI tools — AI Spend Audit`
      : "My AI stack is already optimized — AI Spend Audit";
  const description =
    monthly > 0
      ? `This free audit found $${monthly}/month ($${annual}/year) in potential savings across my AI tool stack. Run your own audit free.`
      : "This free audit checked my entire AI tool stack and found I'm spending optimally. Run your own in 60 seconds.";
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/results/${resolvedParams.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "AI Spend Audit",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
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
            style={{ color: "rgba(203,196,210,0.5)" }}
          >
            <p style={{ fontSize: 22, color: "#fff" }}>Audit not found</p>
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