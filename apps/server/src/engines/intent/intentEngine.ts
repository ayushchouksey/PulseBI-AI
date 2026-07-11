import type { DetectedIntent, IntentLevel, IntentType } from "@pulsebi/shared-types";

const METRIC_KEYWORDS = [
  "revenue", "sales", "profit", "cost", "price", "amount", "quantity",
  "margin", "discount", "shipping", "units", "orders", "customers",
  "expenses", "income", "budget", "growth", "rate", "score",
];

const DIMENSION_KEYWORDS = [
  "region", "country", "city", "state", "category", "product",
  "segment", "channel", "department", "team", "customer", "supplier",
  "brand", "class", "type", "status", "year", "month", "quarter",
];

export function detectIntent(question: string, availableColumns: string[]): DetectedIntent {
  const lower = question.toLowerCase();
  const metric = findMetric(lower, availableColumns);
  const dimension = findDimension(lower, availableColumns);
  const limit = extractLimit(lower);

  const level = classifyLevel(lower);
  const type = classifyType(lower, level);

  return { level, type, metric, dimension, limit };
}

function classifyLevel(question: string): IntentLevel {
  if (/\b(add|remove|delete|replace|pin|create|save|show chart|hide chart|new kpi|remove kpi|add chart|swap)\b/i.test(question)) {
    return "dashboard_modification";
  }
  if (/\b(compare|vs|versus|why|explain|trend|over time|growth|show me|analyze|analysis|breakdown|distribution|correlation|relationship|monthly|quarterly|yearly|before and after|difference)\b/i.test(question)) {
    return "analysis";
  }
  return "information";
}

function classifyType(question: string, _level: IntentLevel): IntentType {
  if (/\b(top)\s+(\d+)/i.test(question)) return "top";
  if (/\b(bottom)\s+(\d+)/i.test(question)) return "bottom";
  if (/\b(highest|maximum|max|best)\b/i.test(question)) return "highest";
  if (/\b(lowest|minimum|min|worst|least)\b/i.test(question)) return "lowest";
  if (/\b(compare|vs|versus|against|difference)\b/i.test(question)) return "compare";
  if (/\b(trend|over time|growth|change|evolution)\b/i.test(question)) return "trend";
  if (/\b(average|mean|avg)\b/i.test(question)) return "average";
  if (/\b(sum|total|aggregate|add up)\b/i.test(question) && question.includes("profit") || question.includes("revenue") || question.includes("sales") || question.includes("cost") || question.includes("amount")) return "sum";
  if (/\b(count|how many|number of)\b/i.test(question)) return "count";
  if (/\btotal\b/i.test(question)) return "sum";
  if (/\b(explain|why|reason|cause)\b/i.test(question)) return "explain";
  if (/\b(summary|summarize|overview|recap)\b/i.test(question)) return "summary";
  if (/\b(recommend|suggestion|advice|should)\b/i.test(question)) return "recommendation";
  if (/\b(add chart|show chart|new chart|create chart|pin)\b/i.test(question)) return "chart_add";
  if (/\b(remove chart|delete chart|hide chart)\b/i.test(question)) return "chart_remove";
  if (/\b(replace chart|swap chart|change chart)\b/i.test(question)) return "chart_replace";
  if (/\b(highlight|emphasize|focus on)\b/i.test(question)) return "highlight";
  if (/\b(filter|show only|where)\b/i.test(question)) return "filter";
  if (/\b(sort|order|rank|arrange)\b/i.test(question)) return "sort";
  if (/\b(add kpi|new kpi|show kpi)\b/i.test(question)) return "kpi_add";
  if (/\b(remove kpi|hide kpi|delete kpi)\b/i.test(question)) return "kpi_remove";
  return "unknown";
}

function findMetric(text: string, columns: string[]): string | undefined {
  for (const col of columns) {
    if (text.includes(col.toLowerCase())) return col;
  }
  for (const kw of METRIC_KEYWORDS) {
    if (text.includes(kw)) {
      const match = columns.find((c) => c.toLowerCase().includes(kw));
      if (match) return match;
    }
  }
  return undefined;
}

function findDimension(text: string, columns: string[]): string | undefined {
  for (const col of columns) {
    if (text.includes(col.toLowerCase())) return col;
  }
  for (const kw of DIMENSION_KEYWORDS) {
    if (text.includes(kw)) {
      const match = columns.find((c) => c.toLowerCase().includes(kw));
      if (match) return match;
    }
  }
  return undefined;
}

function extractLimit(text: string): number | undefined {
  const match = text.match(/top\s+(\d+)/i) || text.match(/bottom\s+(\d+)/i) || text.match(/(\d+)\s+(?:top|best|worst)/i);
  return match ? parseInt(match[1], 10) : undefined;
}
