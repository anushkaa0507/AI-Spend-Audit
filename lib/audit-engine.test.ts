import { runAudit } from "../lib/audit-engine";

describe("runAudit — ChatGPT", () => {
  test("team plan with 2 seats recommends downgrade to Plus", () => {
    const result = runAudit({
      teamSize: 2,
      primaryUseCase: "writing",
      tools: [{ name: "ChatGPT", plan: "Team", monthlySpend: 60, seats: 2 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBeGreaterThan(0);
    expect(rec.recommendedAction).toMatch(/Plus/i);
  });

  test("enterprise with 5 seats recommends downgrade to Team", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "mixed",
      tools: [{ name: "ChatGPT", plan: "Enterprise", monthlySpend: 300, seats: 5 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBeGreaterThan(0);
    expect(rec.recommendedAction).toMatch(/Team/i);
  });
});

describe("runAudit — Claude", () => {
  test("Max plan single seat recommends downgrade to Pro", () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [{ name: "Claude", plan: "Max", monthlySpend: 100, seats: 1 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBe(80);
    expect(rec.recommendedAction).toMatch(/Pro/i);
  });
});

describe("runAudit — GitHub Copilot", () => {
  test("Business plan with 2-person team recommends Individual", () => {
    const result = runAudit({
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [{ name: "GitHub Copilot", plan: "Business", monthlySpend: 38, seats: 2 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBe(18);
    expect(rec.recommendedAction).toMatch(/Individual/i);
  });
});

describe("runAudit — Cursor", () => {
  test("Business plan with 2-person team recommends Pro", () => {
    const result = runAudit({
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [{ name: "Cursor", plan: "Business", monthlySpend: 80, seats: 2 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBe(40);
    expect(rec.recommendedAction).toMatch(/Pro/i);
  });
});

describe("runAudit — totals", () => {
  test("totalAnnualSavings equals totalMonthlySavings * 12", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        { name: "ChatGPT", plan: "Team", monthlySpend: 60, seats: 2 },
        { name: "Cursor", plan: "Business", monthlySpend: 80, seats: 2 },
      ],
    });
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  test("no savings returned for correctly priced plan", () => {
    const result = runAudit({
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [{ name: "GitHub Copilot", plan: "Business", monthlySpend: 190, seats: 10 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBe(0);
  });

  test("overpayment detected when reported spend exceeds official rate by 5%", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "writing",
      tools: [{ name: "Claude", plan: "Pro", monthlySpend: 150, seats: 5 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBeGreaterThan(0);
  });
});

describe("runAudit — API tools", () => {
  test("high API spend triggers optimization recommendation", () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [{ name: "Anthropic API", plan: "API Direct", monthlySpend: 800, seats: 1 }],
    });
    const rec = result.recommendations[0];
    expect(rec.savings).toBeGreaterThan(0);
    expect(rec.recommendedAction).toMatch(/cach/i);
  });
});