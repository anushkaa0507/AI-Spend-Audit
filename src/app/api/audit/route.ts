import { runAudit } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const audit = runAudit(body);

    const summary =
      await generateSummary(audit);

    const id = uuid();

    await supabase
      .from("audits")
      .insert({
        id,
        tools: body.tools,
        results:
          audit.recommendations,
        ai_summary: summary,
        total_monthly_savings:
          audit.totalMonthlySavings,
        total_annual_savings:
          audit.totalAnnualSavings,
      });

    return Response.json({
      success: true,
      id,
      audit,
      summary,
    });

  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      error: "Audit failed",
    });
  }
}