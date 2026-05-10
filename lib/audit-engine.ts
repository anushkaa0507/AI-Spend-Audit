export function runAudit(data: any) {
  const recommendations = [];
  let totalSavings = 0;
  for (const tool of data.tools) {
    if (tool.name === "ChatGPT" && tool.plan === "Team" && data.teamSize <= 2) {
      const optimizedSpend = 40;
      const savings = tool.monthlySpend - optimizedSpend;
      totalSavings += savings;
      recommendations.push({
        tool: tool.name,
        recommendation: "Downgrade to Plus",
        savings,
        reason: "Small teams usually do not require Team plan.",
      });
    }
  }
  return {
    recommendations,
    totalMonthlySavings: totalSavings,
    totalAnnualSavings: totalSavings * 12,
  };
}
