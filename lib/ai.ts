export async function generateSummary(audit: any): Promise<string> {
  const fallback = buildFallback(audit);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000",
        "X-Title": "AI Spend Audit",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content:
              "You are an AI SaaS spend optimization expert. Write concise, professional executive summaries. Be specific about numbers. Never exceed 120 words.",
          },
          {
            role: "user",
            content: `Write a 80-100 word executive summary of this AI spend audit. Mention the total monthly savings, the top recommendation, and one actionable next step.\n\nAudit:\n${JSON.stringify(audit, null, 2)}`,
          },
        ],
      }),
    });

    if (!res.ok) return fallback;

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || fallback;
  } catch {
    return fallback;
  }
}

function buildFallback(audit: any): string {
  const monthly = audit.totalMonthlySavings ?? 0;
  const annual = audit.totalAnnualSavings ?? 0;
  const topRec = audit.recommendations?.[0];
  if (monthly === 0) {
    return "Your AI tool stack appears well-optimized for your current team size and use case. No immediate plan-level changes are recommended. Continue monitoring usage as your team grows, and revisit this audit when you add new tools or seat counts change significantly.";
  }
  return `This audit identified $${monthly}/month ($${annual}/year) in potential savings across your AI tool stack. ${topRec ? `The highest-impact action is: ${topRec.recommendedAction} for ${topRec.tool}, saving $${topRec.savings}/month. ` : ""}Review each recommendation and prioritize the highest-savings items first. Consider consolidating overlapping tools to reduce per-seat costs.`;
}