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

// ─── Role definitions per intent level ───────────────────────────

const ROLE_MAP: Record<string, string> = {
  information: "Business Consultant — answer precisely with verified numbers. Be concise, authoritative.",
  analysis: "Data Interpreter — explain patterns, correlations, and root causes. Be insightful.",
  recommendation: "Strategic Advisor — recommend business priorities based on data. Be actionable.",
  executive_brief: "Executive Assistant — deliver CEO-ready brief with metrics and risks. Be crisp.",
  decision_support: "Decision Analyst — evaluate options with data evidence. Be balanced.",
  highlight: "Dashboard Guide — direct attention to relevant charts. Be elegant.",
  explain: "Business Analyst — explain causes and patterns. Be thorough.",
  dashboard_modification: "Dashboard Designer — confirm changes made to the dashboard. Be clear.",
};

export function buildChatPrompt(input: PromptBuilderInput): string {
  const { question, intent, summaryRequest, dashboard, queryResult, queryData } = input;

  const sections: string[] = [];

  sections.push(`You are PulseBI AI acting as a ${ROLE_MAP[intent.level] || ROLE_MAP.information}.`);
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

  // Mode-specific instructions
  switch (intent.level) {
    case "information":
      sections.push("Respond with a direct, concise answer. 1-3 sentences. Include the key number prominently.");
      sections.push("Format: **Metric Name**: Value. Optional context sentence.");
      break;
    case "analysis":
      sections.push("Provide the analysis. Explain what the data reveals. Be insightful but concise.");
      sections.push("Structure: Finding → Evidence → Implication.");
      break;
    case "recommendation":
      sections.push("Recommend 2-4 prioritized business actions. Each with a clear reason.");
      sections.push("Structure: Priority → Why it matters → Expected impact.");
      break;
    case "executive_brief":
      sections.push("Deliver a CEO-ready brief. Lead with metrics. Mention risks and opportunities.");
      sections.push("Structure: Key Metrics → Risks → Opportunities → Recommendation.");
      sections.push("Be crisp. No fluff. Every sentence must carry information.");
      break;
    case "decision_support":
      sections.push("Evaluate the decision. Present factors for and against. Give a verdict with confidence level.");
      sections.push("Structure: Verdict → Supporting Factors → Risks → Confidence.");
      break;
    case "highlight":
      sections.push("Direct attention to the relevant chart. Explain what it shows. Be elegant and brief.");
      break;
    case "explain":
      sections.push("Explain the causes and patterns. Be thorough but structured.");
      sections.push("Structure: What's happening → Why → What to do about it.");
      break;
    case "dashboard_modification":
      sections.push("Confirm the dashboard modification. Explain what changed and why it's useful.");
      break;
    default:
      sections.push("Provide a clear, helpful response based on the verified data.");
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
