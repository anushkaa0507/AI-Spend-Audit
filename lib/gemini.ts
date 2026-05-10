import {
  GoogleGenerativeAI,
} from "@google/generative-ai";
const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );
export async function generateSummary(
  audit: any
) {
  try {
    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
    const result =
      await model.generateContent(
        `Summarize this audit:
        ${JSON.stringify(audit)}`
      );
    return result.response.text();
  } catch {
    return `
    Your AI stack has optimization opportunities.
    `;
  }
}