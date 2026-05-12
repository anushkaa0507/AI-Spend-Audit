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
        {
          success: false,
          error: "Please wait before submitting again.",
        },
        { status: 429 }
      );
    }

    LEAD_RATE_MAP.set(ip, Date.now());

    const body = await request.json();

    const {
      auditId,
      email,
      company,
      role,
      teamSize,
      __hp,
    } = body;

    if (__hp && __hp !== "") {
      return NextResponse.json({ success: true });
    }

    if (!email || !auditId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and auditId are required.",
        },
        { status: 400 }
      );
    }

    // SAVE LEAD
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .insert([
        {
          audit_id: auditId,
          email,
          company,
          role,
          team_size: teamSize,
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.log("SUPABASE ERROR:", leadError);

      return NextResponse.json(
        {
          success: false,
          error: leadError.message,
        },
        { status: 500 }
      );
    }

    // GET AUDIT
    const { data: auditData, error: auditError } = await supabase
      .from("audits")
      .select("total_monthly_savings, total_annual_savings")
      .eq("id", auditId)
      .single();

    if (auditError) {
      console.log("AUDIT FETCH ERROR:", auditError);
    }

    const monthly = auditData?.total_monthly_savings ?? 0;
    const annual = auditData?.total_annual_savings ?? 0;

    // SEND EMAIL
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your AI Spend Audit Report",

      html: `
        <div style="font-family:Inter,sans-serif;padding:40px;background:#09090f;color:white">
          <h1>Your AI Spend Audit</h1>

          <p>We found potential savings for your stack.</p>

          <div style="padding:24px;border-radius:12px;background:#18181b;margin:24px 0">
            <h2>$${monthly}/month</h2>
            <p>$${annual}/year potential savings</p>
          </div>

          <a
            href="${process.env.NEXT_PUBLIC_BASE_URL}/results/${auditId}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#7c3aed;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            View Full Report
          </a>
        </div>
      `,
    });

    console.log("EMAIL RESPONSE:", emailResponse);

    return NextResponse.json({
      success: true,
      lead: leadData,
      emailResponse,
    });

  } catch (error) {
    console.error("LEADS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save lead",
      },
      { status: 500 }
    );
  }
}