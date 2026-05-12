export type ToolInput = {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  primaryUseCase: string;
  tools: ToolInput[];
};

export type Recommendation = {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
};

export type AuditResult = {
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
};

const PRICING: Record<string, Record<string, number>> = {
  chatgpt: {
    free: 0,
    plus: 20,
    team: 30,
    enterprise: 60,
    "api direct": 0,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: 0,
    "api direct": 0,
  },
  "github copilot": {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 0,
  },
  "anthropic api": {
    "api direct": 0,
  },
  "openai api": {
    "api direct": 0,
  },
  gemini: {
    free: 0,
    pro: 19.99,
    ultra: 49.99,
    "api direct": 0,
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 35,
    enterprise: 0,
  },
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function officialPricePerSeat(toolName: string, plan: string): number | null {
  const t = normalize(toolName);
  const p = normalize(plan);
  const toolPricing = PRICING[t];
  if (!toolPricing) return null;
  return toolPricing[p] ?? null;
}

export function runAudit(data: AuditInput): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalSavings = 0;

  for (const tool of data.tools) {
    const tn = normalize(tool.name);
    const plan = normalize(tool.plan);
    const seats = tool.seats;
    const reported = tool.monthlySpend;
    const teamSize = data.teamSize;
    const useCase = normalize(data.primaryUseCase);

    const officialPerSeat = officialPricePerSeat(tool.name, tool.plan);
    const officialTotal = officialPerSeat !== null ? officialPerSeat * seats : null;

    let savings = 0;
    let action = "Keep current plan";
    let reason = "Your current plan appears well-matched to your team size and use case.";

    if (tn === "chatgpt") {
      if (plan === "team" && seats <= 2) {
        const cheaperTotal = 20 * seats;
        savings = reported - cheaperTotal;
        action = "Downgrade to ChatGPT Plus (per seat)";
        reason = `ChatGPT Team ($30/seat/mo) adds shared workspace and admin controls, but with only ${seats} seat(s) these features don't justify the premium. ChatGPT Plus ($20/seat/mo) provides identical model access. Switching saves $${savings}/mo.`;
      } else if (plan === "enterprise" && seats < 10) {
        const teamTotal = 30 * seats;
        savings = reported - teamTotal;
        action = "Downgrade to ChatGPT Team";
        reason = `ChatGPT Enterprise is designed for 150+ seat orgs with SSO, audit logs, and dedicated capacity. With ${seats} seats you're paying for enterprise overhead ($60/seat vs $30/seat) without the scale to justify it. Team plan covers your needs.`;
      } else if ((plan === "plus" || plan === "team") && useCase === "coding") {
        action = "Consider switching to Cursor Pro or GitHub Copilot";
        const altTotal = 20 * seats;
        savings = Math.max(0, reported - altTotal);
        reason = `For coding-primary teams, Cursor Pro ($20/seat) or GitHub Copilot Business ($19/seat) provides IDE-native AI with context-aware autocomplete, which outperforms ChatGPT's chat interface for developer workflows. You'd keep Claude/GPT-4 access through the IDE integrations.`;
      } else {
        action = "Current plan is appropriate";
        reason = `At ${seats} seat(s) on ${tool.plan}, your ChatGPT cost ($${reported}/mo) aligns with the official rate of $${officialTotal ?? "N/A"}/mo. No immediate savings identified.`;
      }
    }

    else if (tn === "claude") {
      if (plan === "max" && seats === 1) {
        savings = reported - 20;
        action = "Downgrade to Claude Pro";
        reason = `Claude Max ($100/mo) provides 5x higher usage limits and extended thinking. For a single-seat individual user not hitting Pro's rate limits ($20/mo), this is a $80/mo premium for headroom you may not need. Monitor usage and upgrade only if you regularly hit limits.`;
      } else if (plan === "team" && seats <= 2) {
        const proTotal = 20 * seats;
        savings = reported - proTotal;
        action = "Switch to Claude Pro (individual seats)";
        reason = `Claude Team ($30/seat/mo) adds admin controls and priority access, but with ${seats} seat(s) the admin layer isn't meaningful. Claude Pro ($20/seat) provides the same Claude 3.5 Sonnet / Opus access. Saves $${savings}/mo.`;
      } else if (plan === "pro" && useCase === "coding" && seats > 1) {
        action = "Supplement with Cursor Pro; consider Claude API direct";
        savings = 0;
        reason = `For multi-seat coding teams on Claude Pro, the Anthropic API direct (pay-per-token) often undercuts flat subscriptions if usage is moderate. At ~$3/M input tokens (claude-3-5-sonnet), 1M tokens/month is $3 vs $20 flat. Worth auditing actual token usage.`;
      } else {
        action = "Current plan is appropriate";
        reason = `Claude ${tool.plan} at ${seats} seat(s) is well-matched to your reported $${reported}/mo spend. No plan-level savings identified.`;
      }
    }

    else if (tn === "github copilot") {
      if (plan === "business" && teamSize <= 3) {
        const individualTotal = 10 * seats;
        savings = reported - individualTotal;
        action = "Downgrade to GitHub Copilot Individual";
        reason = `Copilot Business ($19/seat/mo) adds policy management and org-wide telemetry exclusion. With ${teamSize} developers, individual plans ($10/seat/mo) provide the same AI coding assistance without the admin overhead. Saves $${savings}/mo.`;
      } else if (plan === "enterprise" && teamSize < 50) {
        const bizTotal = 19 * seats;
        savings = reported - bizTotal;
        action = "Downgrade to GitHub Copilot Business";
        reason = `Copilot Enterprise ($39/seat/mo) adds Copilot Chat in GitHub.com and custom knowledge bases from your repos. For teams under 50 this rarely justifies double the Business plan cost. Business at $19/seat covers chat in IDE and PR summaries.`;
      } else if (useCase === "coding" && reported > 19 * seats) {
        action = "Audit overpayment vs. official rate";
        savings = reported - 19 * seats;
        reason = `Your reported spend ($${reported}/mo) exceeds the official Business rate ($${19 * seats}/mo for ${seats} seats). Verify billing — unused seats or annual-to-monthly conversion may be causing overpayment.`;
      } else {
        action = "Current plan is appropriate";
        reason = `GitHub Copilot ${tool.plan} is the right fit for a ${teamSize}-person coding team. Pricing is competitive at $${officialPerSeat}/seat/mo.`;
      }
    }

    else if (tn === "cursor") {
      if (plan === "business" && teamSize <= 3) {
        const proTotal = 20 * seats;
        savings = reported - proTotal;
        action = "Downgrade to Cursor Pro";
        reason = `Cursor Business ($40/seat/mo) adds SSO, audit logs, and admin controls. With ${teamSize} developers these governance features are unnecessary overhead. Cursor Pro ($20/seat/mo) provides the same AI model access and autocomplete. Saves $${savings}/mo.`;
      } else if (plan === "pro" && useCase !== "coding") {
        action = "Consider switching to ChatGPT Plus or Claude Pro";
        savings = 0;
        reason = `Cursor Pro is IDE-centric and optimized for code generation. For ${useCase}-primary workflows, Claude Pro or ChatGPT Plus ($20/mo) provides a more versatile interface. Unless you're writing significant amounts of code, Cursor's value-add doesn't apply.`;
      } else {
        action = "Current plan is appropriate";
        reason = `Cursor ${tool.plan} is well-suited for a coding team of ${seats}. The AI autocomplete ROI is typically positive for full-time developers.`;
      }
    }

    else if (tn === "gemini") {
      if (plan === "ultra" && useCase !== "data" && useCase !== "research") {
        const proTotal = 19.99 * seats;
        savings = Math.round(reported - proTotal);
        action = "Downgrade to Gemini Pro";
        reason = `Gemini Ultra ($49.99/mo) is differentiated for complex multimodal reasoning and large-context data tasks. For ${useCase} use cases, Gemini Pro ($19.99/mo) covers text, code, and standard multimodal needs. The $30/mo premium is unjustified unless you regularly hit Pro's capability ceiling.`;
      } else if (plan === "pro" && useCase === "coding") {
        action = "Consider GitHub Copilot or Cursor as primary coding tool";
        savings = 0;
        reason = `Gemini Pro provides solid general-purpose AI but lacks the deep IDE integration of Cursor or GitHub Copilot. For coding-primary use, a dedicated coding AI at similar cost ($15-20/mo) will have meaningfully higher developer productivity ROI.`;
      } else {
        action = "Current plan is appropriate";
        reason = `Gemini ${tool.plan} at $${reported}/mo is appropriately priced for your ${useCase} use case.`;
      }
    }

    else if (tn === "windsurf") {
      if (plan === "team" && seats <= 3) {
        const proTotal = 15 * seats;
        savings = reported - proTotal;
        action = "Downgrade to Windsurf Pro";
        reason = `Windsurf Team ($35/seat/mo) adds team collaboration features. With ${seats} seat(s), individual Pro plans ($15/seat/mo) give the same AI coding capability. Saves $${savings}/mo.`;
      } else if (plan === "pro" && useCase === "coding" && seats > 5) {
        action = "Compare against Cursor Business ($40/seat) or GitHub Copilot Business ($19/seat)";
        savings = 0;
        reason = `At ${seats}+ seats, GitHub Copilot Business ($19/seat) is significantly cheaper than Windsurf Pro ($15/seat) while offering broader IDE support and enterprise telemetry controls. Worth a structured trial.`;
      } else {
        action = "Current plan is appropriate";
        reason = `Windsurf ${tool.plan} is reasonably priced for your team configuration.`;
      }
    }

    else if (tn === "anthropic api" || tn === "openai api") {
      if (reported > 500) {
        action = "Audit token usage — consider prompt caching & batching";
        savings = Math.round(reported * 0.2);
        reason = `At $${reported}/mo in API spend, prompt caching (reduces repeated context costs by up to 90%) and the Batch API (50% discount on throughput workloads) are the highest-leverage optimizations available. A 20% reduction is conservative if caching isn't already implemented.`;
      } else if (reported > 100) {
        action = "Enable prompt caching for repeated system prompts";
        savings = Math.round(reported * 0.1);
        reason = `Anthropic's prompt caching writes repeated prefixes to cache at $0.30/M tokens, then reads at $0.03/M — a 10x reduction on cached portions. For apps with consistent system prompts, this alone often cuts API costs 10-30%.`;
      } else {
        action = "API spend is modest — no immediate action needed";
        reason = `At $${reported}/mo your API spend is within healthy bounds. Monitor token consumption as you scale; set billing alerts at 2x current spend.`;
      }
    }

    else {
      action = "Verify pricing against vendor's official page";
      reason = `We don't have detailed plan logic for ${tool.name} yet. Verify your spend matches the official rate and check if a lower tier covers your actual usage.`;
    }

    if (officialTotal !== null && reported > officialTotal * 1.05 && savings === 0) {
      const overpayment = Math.round(reported - officialTotal);
      if (overpayment > 0) {
        savings = overpayment;
        action = "Audit billing — possible seat over-count";
        reason = `Your reported spend ($${reported}/mo) is ${Math.round(((reported - officialTotal) / officialTotal) * 100)}% above the official ${tool.plan} rate ($${officialTotal}/mo for ${seats} seats). Check for unused seats, duplicate subscriptions, or billing cycle mismatches.`;
      }
    }

    savings = Math.max(0, Math.round(savings));
    totalSavings += savings;

    recommendations.push({
      tool: tool.name,
      currentPlan: tool.plan,
      currentSpend: reported,
      recommendedAction: action,
      savings,
      reason,
    });
  }

  return {
    recommendations,
    totalMonthlySavings: Math.round(totalSavings),
    totalAnnualSavings: Math.round(totalSavings * 12),
  };
}