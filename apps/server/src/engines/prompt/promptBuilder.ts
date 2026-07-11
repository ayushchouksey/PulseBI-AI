import type { DetectedIntent, ExecutiveSummaryRequest, DashboardJSON } from "@pulsebi/shared-types";
import { formatSummaryForLLM } from "../dashboard/dashboardEngine.js";

export interface PromptBuilderInput {
  question: string;
  intent: DetectedIntent;
  summaryRequest: ExecutiveSummaryRequest;
  dashboard: DashboardJSON;
  queryResult?: string;
  queryData?: Record<string, unknown>[];
}

export function buildChatPrompt(input: PromptBuilderInput): string {
  const { question, intent, summaryRequest, dashboard, queryResult, queryData } = input;

  const sections: string[] = [];

  sections.push("You are PulseBI AI, a business intelligence assistant.");
  sections.push("");
  sections.push("CRITICAL RULES:");
  sections.push("- You are given pre-computed, verified data. Use it directly.");
  sections.push("- Never say you cannot answer. The data is provided below.");
  sections.push("- Never estimate or guess. Use only the verified facts provided.");
  sections.push("- Keep responses concise and actionable.");
  sections.push("- Always reference specific numbers from the data.");
  sections.push("");

  sections.push("=== DATASET CONTEXT ===");
  sections.push(`Dataset: ${dashboard.title}`);
  sections.push(`Records: ${dashboard.subtitle}`);
  sections.push("");

  const verifiedFacts = formatSummaryForLLM(summaryRequest);
  sections.push(verifiedFacts);
  sections.push("");

  if (queryResult) {
    sections.push("=== QUERY ENGINE RESULT (use this data to answer) ===");
    sections.push(queryResult);
    sections.push("");
  }

  if (queryData && queryData.length > 0) {
    sections.push("=== RAW DATA RECORDS ===");
    const preview = queryData.slice(0, 10);
    for (const row of preview) {
      const parts = Object.entries(row)
        .filter(([k]) => k !== "_index")
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      sections.push(`  { ${parts} }`);
    }
    if (queryData.length > 10) {
      sections.push(`  ... and ${queryData.length - 10} more records`);
    }
    sections.push("");
  }

  sections.push("=== USER QUESTION ===");
  sections.push(question);
  sections.push("");

  sections.push("=== INSTRUCTIONS ===");
  sections.push("Answer the user's question using the data above.");
  sections.push("Be specific: mention actual values, names, and numbers.");
  sections.push("If the data shows a clear answer, state it directly.");
  sections.push("Format your response as a clear, helpful business answer.");

  return sections.join("\n");
}

export function buildSummaryPrompt(request: ExecutiveSummaryRequest): string {
  const verifiedFacts = formatSummaryForLLM(request);

  return `You are PulseBI AI, a business intelligence assistant.

CRITICAL RULES:
- Never calculate. Never estimate. Never invent.
- Use ONLY the verified business facts provided below.
- Write a brief executive summary (3-5 sentences).
- Include 3-4 key highlights.
- Suggest 2-3 follow-up questions the user might ask.

=== VERIFIED BUSINESS FACTS ===
${verifiedFacts}

=== REQUIRED OUTPUT FORMAT ===
Return a JSON object with these exact fields:
- greeting: A brief personalized greeting (e.g., "Good Morning")
- summary: 3-5 sentence executive summary
- highlights: Array of 3-4 key bullet points
- followUpQuestions: Array of 2-3 suggested follow-up questions

Return ONLY the JSON object, no other text.`;
}
