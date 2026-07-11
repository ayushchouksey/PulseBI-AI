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
  const type = classifyType(lower, level, metric, dimension);

  return { level, type, metric, dimension, limit };
}

// ─── Level Classification (priority order: highest first) ────────

function classifyLevel(question: string): IntentLevel {
  // 1. Dashboard modifications — explicit actions only
  if (/\b(add|remove|delete|replace|pin|create|save|swap|make a|put|include)\b/i.test(question)) {
    if (/\b(chart|graph|visualization|plot|visual|kpi|widget)\b/i.test(question)) {
      return "dashboard_modification";
    }
  }

  // 2. Executive briefing — CEO-mode
  if (/\b(executive|brief|briefing|summary|overview|recap|today|standup|daily|weekly)\b/i.test(question)) {
    if (/\b(brief|summary|overview|recap|standup|business|executive)\b/i.test(question)) {
      return "executive_brief";
    }
  }

  // 3. Recommendation — what should I focus on / improve (check BEFORE decision_support)
  if (/\b(what should|what do you suggest|what do you recommend|focus on|improve|priority|priorities|prioritize|next steps|action items)\b/i.test(question)) {
    return "recommendation";
  }

  // 4. Decision support — should I / should we questions (not "what should")
  if (/\b(should i|should we|should the|is it worth|is it advisable|do you recommend|would you recommend)\b/i.test(question)) {
    if (!/\bwhat\b/i.test(question)) {
      return "decision_support";
    }
  }

  // 5. Highlight — which/what ... best/worst/performs (point to existing chart)
  if (/\b(which|what)\b.*\b(best|worst|highest|lowest|top|bottom|biggest|smallest|most|least|performs?|outstanding|leading)\b/i.test(question)) {
    return "highlight";
  }

  // 6. Explain — why/explain/reason without chart intent
  if (/\b(explain|why|reason|cause|how come|what causes|what makes)\b/i.test(question)) {
    return "explain";
  }

  // 7. Analysis — temporary investigation
  if (/\b(compare|vs|versus|trend|over time|growth|show me|analyze|analysis|breakdown|distribution|correlation|relationship|monthly|quarterly|yearly|before and after|difference|seasonality)\b/i.test(question)) {
    return "analysis";
  }

  // 8. Information — default
  return "information";
}

// ─── Type Classification ─────────────────────────────────────────

function classifyType(question: string, _level: IntentLevel, metric?: string, dimension?: string): IntentType {
  // Dashboard modifications
  if (/\b(add|create|make|put|include|show|new|build)\b.*\b(chart|graph|visualization|plot|visual)\b/i.test(question)) return "chart_add";
  if (/\b(remove|delete|hide|drop)\b.*\b(chart|graph|visualization|plot|visual)\b/i.test(question)) return "chart_remove";
  if (/\b(replace|swap|change|update|modify)\b.*\b(chart|graph|visualization|plot|visual)\b/i.test(question)) return "chart_replace";
  if (/\b(chart|graph|visualization|plot|visual)\b.*(for|of|by|showing|displaying|with)\b/i.test(question)) return "chart_add";
  if (/\b(add|create|make|new|build)\b.*\b(for|of|by|showing|displaying)\b/i.test(question) && !/\bkpi\b/i.test(question)) return "chart_add";
  if (/\b(add|create|make|new|build|show)\b.*\bkpi\b/i.test(question)) {
    // If the mentioned metric is a dimension (like "Customer"), it's a chart, not a KPI
    if (dimension && !metric) return "chart_add";
    return "kpi_add";
  }
  if (/\b(remove|delete|hide|drop)\b.*\bkpi\b/i.test(question)) return "kpi_remove";

  // Recommendation
  if (/\b(what should|focus|improve|priority|priorities|next steps|action|suggest|recommend)\b/i.test(question)) return "recommendation";

  // Executive brief
  if (/\b(executive|brief|briefing|summary|overview|recap|standup)\b/i.test(question)) return "executive_brief";

  // Decision support
  if (/\b(should i|should we|is it worth|recommend)\b/i.test(question)) return "decision_support";

  // Highlight
  if (/\b(highlight|emphasize|focus on|which.*best|which.*worst|which.*performs)\b/i.test(question)) return "highlight";

  // Explain
  if (/\b(explain|why|reason|cause|seasonality)\b/i.test(question)) return "explain";

  // Analysis / query types
  if (/\b(top)\s+(\d+)/i.test(question)) return "top";
  if (/\b(bottom)\s+(\d+)/i.test(question)) return "bottom";
  if (/\b(highest|maximum|max|best)\b/i.test(question)) return "highest";
  if (/\b(lowest|minimum|min|worst|least)\b/i.test(question)) return "lowest";
  if (/\b(compare|vs|versus|against|difference)\b/i.test(question)) return "compare";
  if (/\b(trend|over time|growth|change|evolution)\b/i.test(question)) return "trend";
  if (/\b(average|mean|avg)\b/i.test(question)) return "average";
  if (/\b(sum|total|aggregate|add up)\b/i.test(question)) return "sum";
  if (/\btotal\b/i.test(question)) return "sum";
  if (/\b(count|how many|number of)\b/i.test(question)) return "count";
  if (/\b(summary|summarize)\b/i.test(question)) return "summary";
  if (/\b(filter|show only|where)\b/i.test(question)) return "filter";
  if (/\b(sort|order|rank|arrange)\b/i.test(question)) return "sort";

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
