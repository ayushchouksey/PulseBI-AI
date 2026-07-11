import type { DetectedIntent, IntentType } from "@pulsebi/shared-types";

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

  let detectedType: IntentType = "unknown";

  if (/\b(top)\s+(\d+)/i.test(lower)) {
    detectedType = "top";
  } else if (/\b(bottom)\s+(\d+)/i.test(lower)) {
    detectedType = "bottom";
  } else if (/\b(highest|maximum|max|best)\b/i.test(lower)) {
    detectedType = "highest";
  } else if (/\b(lowest|minimum|min|worst|least)\b/i.test(lower)) {
    detectedType = "lowest";
  } else if (/\b(compare|vs|versus|against|difference)\b/i.test(lower)) {
    detectedType = "compare";
  } else if (/\b(trend|over time|growth|change|evolution)\b/i.test(lower)) {
    detectedType = "trend";
  } else if (/\b(average|mean|avg)\b/i.test(lower)) {
    detectedType = "average";
  } else if (/\b(sum|total|aggregate|add up)\b/i.test(lower) && metric) {
    detectedType = "sum";
  } else if (/\b(count|how many|number of)\b/i.test(lower)) {
    detectedType = "count";
  } else if (/\btotal\b/i.test(lower)) {
    detectedType = metric ? "sum" : "count";
  } else if (/\b(explain|why|reason|cause)\b/i.test(lower)) {
    detectedType = "explain";
  } else if (/\b(summary|summarize|overview|recap)\b/i.test(lower)) {
    detectedType = "summary";
  } else if (/\b(recommend|suggestion|advice|should)\b/i.test(lower)) {
    detectedType = "recommendation";
  } else if (/\b(add chart|show chart|new chart|create chart)\b/i.test(lower)) {
    detectedType = "chart_add";
  } else if (/\b(remove chart|delete chart|hide chart)\b/i.test(lower)) {
    detectedType = "chart_remove";
  } else if (/\b(replace chart|swap chart|change chart)\b/i.test(lower)) {
    detectedType = "chart_replace";
  } else if (/\b(highlight|emphasize|focus on)\b/i.test(lower)) {
    detectedType = "highlight";
  } else if (/\b(filter|show only|where)\b/i.test(lower)) {
    detectedType = "filter";
  } else if (/\b(sort|order|rank|arrange)\b/i.test(lower)) {
    detectedType = "sort";
  } else if (/\b(add kpi|new kpi|show kpi)\b/i.test(lower)) {
    detectedType = "kpi_add";
  } else if (/\b(remove kpi|hide kpi|delete kpi)\b/i.test(lower)) {
    detectedType = "kpi_remove";
  }

  const filter = extractFilter(lower, availableColumns);
  const limit = extractLimit(lower);

  return { type: detectedType, metric, dimension, filter, limit };
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

function extractFilter(text: string, columns: string[]): { column: string; value: string | number } | undefined {
  const filterPatterns = [
    /(?:where|for|in|of|from)\s+(\w+)\s+(?:is|=|==)\s+(\w+)/i,
    /(?:where|for|in|of|from)\s+(\w+)\s+(\w+)/i,
  ];

  for (const pattern of filterPatterns) {
    const match = text.match(pattern);
    if (match) {
      const potentialCol = columns.find((c) => c.toLowerCase().includes(match[1].toLowerCase()));
      if (potentialCol) {
        return { column: potentialCol, value: match[2] };
      }
    }
  }
  return undefined;
}

function extractLimit(text: string): number | undefined {
  const match = text.match(/top\s+(\d+)/i) || text.match(/bottom\s+(\d+)/i) || text.match(/(\d+)\s+(?:top|best|worst)/i);
  return match ? parseInt(match[1], 10) : undefined;
}
