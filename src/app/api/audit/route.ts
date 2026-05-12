import { runAudit } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_MAP = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    const now = Date.now();
    const entry = RATE_LIMIT_MAP.get(ip);

    if (entry && now - entry.ts < WINDOW_MS) {
      if (entry.count >= MAX_PER_WINDOW) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please wait a minute." },
          { status: 429 }
        );
      }
      entry.count++;
    } else {
      RATE_LIMIT_MAP.set(ip, { count: 1, ts: now });
    }

    const body = await req.json();

    if (body.__hp && body.__hp !== "") {
      return NextResponse.json({ success: true, id: uuid() });
    }

    if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json(
        { success: false, error: "No tools provided" },
        { status: 400 }
      );
    }

    const audit = runAudit(body);
    const summary = await generateSummary(audit);
    const id = uuid();

    const { error } = await supabase.from("audits").insert({
      id,
      tools: body.tools,
      team_size: body.teamSize,
      primary_use_case: body.primaryUseCase,
      results: audit.recommendations,
      ai_summary: summary,
      total_monthly_savings: audit.totalMonthlySavings,
      total_annual_savings: audit.totalAnnualSavings,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: "Failed to save audit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, audit, summary });
  } catch (error) {
    console.error("Audit route error:", error);
    return NextResponse.json({ success: false, error: "Audit failed" }, { status: 500 });
  }
}