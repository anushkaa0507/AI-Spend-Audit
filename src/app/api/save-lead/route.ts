import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

const LEAD_RATE_MAP = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const last = LEAD_RATE_MAP.get(ip) ?? 0;
    if (Date.now() - last < 30_000) {
      return NextResponse.json(
        { success: false, error: "Please wait before submitting again." },
        { status: 429 }
      );
    }
    LEAD_RATE_MAP.set(ip, Date.now());

    const body = await request.json();
    const { auditId, email, company, role, teamSize, __hp } = body;

    if (__hp && __hp !== "") {
      return NextResponse.json({ success: true });
    }

    if (!email || !auditId) {
      return NextResponse.json(
        { success: false, error: "Email and auditId are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("leads").insert([
      { audit_id: auditId, email, company, role, team_size: teamSize },
    ]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data: auditData } = await supabase
      .from("audits")
      .select("total_monthly_savings, total_annual_savings")
      .eq("id", auditId)
      .single();

    const monthly = auditData?.total_monthly_savings ?? 0;
    const annual = auditData?.total_annual_savings ?? 0;
    const highSavings = monthly > 500;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#09090f;color:#e9ddff;border-radius:16px">
          <h1 style="font-size:28px;font-weight:900;margin-bottom:8px;color:#e9ddff">Your AI Spend Audit</h1>
          <p style="color:rgba(203,196,210,0.7);margin-bottom:24px">Here's a summary of what we found:</p>
          <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:24px;margin-bottom:24px">
            <p style="margin:0;font-size:14px;color:rgba(203,196,210,0.6);text-transform:uppercase;letter-spacing:.08em">Monthly Savings Identified</p>
            <p style="margin:8px 0 0;font-size:40px;font-weight:900;color:#4ade80">$${monthly}</p>
            <p style="margin:4px 0 0;color:rgba(203,196,210,0.5);font-size:14px">$${annual}/year</p>
          </div>
          <p style="color:rgba(203,196,210,0.7)">View your full report at: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/results/${auditId}" style="color:#c4b5fd">${process.env.NEXT_PUBLIC_BASE_URL}/results/${auditId}</a></p>
          ${highSavings ? `<div style="background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.3);border-radius:12px;padding:20px;margin-top:20px"><p style="margin:0;font-weight:700;color:#4ade80">High-savings case detected</p><p style="margin:8px 0 0;color:rgba(203,196,210,0.7);font-size:14px">A Credex consultant will reach out to discuss how we can help capture these savings through vendor credits and enterprise pricing strategy.</p></div>` : ""}
          <p style="color:rgba(203,196,210,0.4);font-size:12px;margin-top:32px">AI Spend Audit · Powered by Credex</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save lead error:", error);
    return NextResponse.json({ success: false, error: "Failed to save lead" }, { status: 500 });
  }
}