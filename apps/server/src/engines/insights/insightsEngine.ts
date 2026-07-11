import type { BusinessInsight } from "@pulsebi/shared-types";
import { generateId } from "@pulsebi/shared-utils";

export interface InsightEngineInput {
  columnStats: { columnName: string; stats: { count: number; avg: number; stdDev: number; outliers: number; min: number; max: number } }[];
  topPerformers: { name: string; value: number }[];
  bottomPerformers: { name: string; value: number }[];
}

export function generateBusinessInsights(input: InsightEngineInput): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  for (const cs of input.columnStats) {
    if (cs.stats.outliers > 0) {
      insights.push({
        id: generateId(),
        type: "warning",
        title: `Outliers in ${cs.columnName}`,
        description: `${cs.stats.outliers} outlier data points detected in ${cs.columnName} using IQR method. Range: ${cs.stats.min.toFixed(2)} - ${cs.stats.max.toFixed(2)}`,
        metric: cs.columnName,
        value: cs.stats.outliers,
        severity: cs.stats.outliers > 5 ? "high" : "low",
      });
    }

    if (cs.stats.stdDev > cs.stats.avg * 0.5 && cs.stats.avg !== 0) {
      insights.push({
        id: generateId(),
        type: "info",
        title: `High variability in ${cs.columnName}`,
        description: `Coefficient of variation is ${((cs.stats.stdDev / Math.abs(cs.stats.avg)) * 100).toFixed(1)}%, indicating significant spread in the data`,
        metric: cs.columnName,
        severity: "medium",
      });
    }
  }

  if (input.topPerformers.length > 0) {
    const top = input.topPerformers[0];
    insights.push({
      id: generateId(),
      type: "positive",
      title: `Top performer: ${top.name}`,
      description: `${top.name} leads with a value of ${top.value.toLocaleString()}`,
      severity: "medium",
    });
  }

  if (input.bottomPerformers.length > 0) {
    const bottom = input.bottomPerformers[0];
    insights.push({
      id: generateId(),
      type: "negative",
      title: `Needs attention: ${bottom.name}`,
      description: `${bottom.name} has the lowest value at ${bottom.value.toLocaleString()}`,
      severity: "medium",
    });
  }

  return insights;
}
