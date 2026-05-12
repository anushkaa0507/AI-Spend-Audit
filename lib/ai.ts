import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function generateSummary(audit: any) {
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",

      messages: [
        {
          role: "system",
          content:
            "You are an AI SaaS spend optimization expert.",
        },
        {
          role: "user",
          content: `
Audit:
${JSON.stringify(audit, null, 2)}

Write a short executive summary of the audit findings.
`,
        },
      ],
    });

    return (
      completion.choices[0]?.message?.content ||
      "Summary unavailable."
    );
  } catch (error) {
    console.error(error);

    return "Your AI stack has optimization opportunities.";
  }
}