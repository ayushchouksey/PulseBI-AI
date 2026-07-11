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

  const roleMap = {
    information: "Business Consultant — answer precisely with verified numbers",
    analysis: "Data Interpreter — explain patterns, correlations, and root causes",
    dashboard_modification: "Dashboard Designer — confirm changes made to the dashboard",
  };

  const sections: string[] = [];

  sections.push(`You are PulseBI AI acting as a ${roleMap[intent.level]}.`);
  sections.push("");
  sections.push("CRITICAL RULES:");
  sections.push("- You are given pre-computed, verified data. Use it directly.");
  sections.push("- Never say you cannot answer. The data is provided below.");
  sections.push("- Never estimate or guess. Use only the verified facts.");
  sections.push("- Be specific: mention actual values, names, and numbers.");
  sections.push("");

  sections.push("=== DATASET CONTEXT ===");
  sections.push(`Dataset: ${dashboard.title} (${dashboard.subtitle})`);
  sections.push("");

  const verifiedFacts = formatSummaryForLLM(summaryRequest);
  sections.push(verifiedFacts);
  sections.push("");

  if (queryResult) {
    sections.push("=== VERIFIED QUERY RESULT ===");
    sections.push(queryResult);
    sections.push("");
  }

  if (queryData && queryData.length > 0) {
    sections.push("=== DATA RECORDS ===");
    for (const row of queryData.slice(0, 10)) {
      const parts = Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(", ");
      sections.push(`  { ${parts} }`);
    }
    sections.push("");
  }

  sections.push("=== USER QUESTION ===");
  sections.push(question);
  sections.push("");

  if (intent.level === "information") {
    sections.push("Respond with a direct, concise answer. No chart needed. 1-3 sentences max.");
  } else if (intent.level === "analysis") {
    sections.push("Provide the analysis answer plus explain what the chart reveals. Be insightful.");
  } else {
    sections.push("Confirm the dashboard modification and explain what changed.");
  }

  return sections.join("\n");
}

export function buildSummaryPrompt(request: ExecutiveSummaryRequest): string {
  const verifiedFacts = formatSummaryForLLM(request);

  return `You are PulseBI AI, a business intelligence assistant.

RULES:
- Never calculate. Never estimate. Never invent.
- Use ONLY the verified business facts provided below.
- Write a brief executive summary (3-5 sentences).
- Include 3-4 key highlights.
- Suggest 2-3 follow-up questions.

=== VERIFIED BUSINESS FACTS ===
${verifiedFacts}

Return a JSON object with:
- greeting: brief greeting (e.g., "Good Morning")
- summary: 3-5 sentence executive summary
- highlights: Array of 3-4 key bullet points
- followUpQuestions: Array of 2-3 suggested questions

Return ONLY the JSON.`;
}
