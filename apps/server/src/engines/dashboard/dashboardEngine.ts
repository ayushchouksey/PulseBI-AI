import type {
  DashboardJSON,
  ExecutiveSummaryRequest,
  ExecutiveSummary,
  NameValuePair,
  TrendResult,
  BusinessInsight,
} from "@pulsebi/shared-types";

export function buildExecutiveSummaryRequest(dashboard: DashboardJSON): ExecutiveSummaryRequest {
  const topPerformers: NameValuePair[] = [];
  const bottomPerformers: NameValuePair[] = [];

  if (dashboard.charts.length > 0) {
    const barChart = dashboard.charts.find((c) => c.type === "bar" || c.type === "pie");
    if (barChart) {
      const data = barChart.config?.data as { name: string; value: number }[] | undefined;
      if (data && Array.isArray(data)) {
        topPerformers.push(...data.slice(0, 3).map((d) => ({
          name: d.name,
          value: d.value,
          percentage: 0,
        })));
        bottomPerformers.push(...data.slice(-3).reverse().map((d) => ({
          name: d.name,
          value: d.value,
          percentage: 0,
        })));
      }
    }
  }

  const trends = dashboard.charts
    .filter((c) => c.type === "line")
    .map((c) => {
      const points = c.config?.points as { x: string; y: number }[] | undefined;
      return {
        dateColumn: c.xAxis || "",
        valueColumn: c.yAxis || "",
        direction: (points && points.length >= 2
          ? (points[points.length - 1].y > points[0].y ? "up" : "down")
          : "flat") as "up" | "down" | "flat",
        avgChange: 0,
        changePercent: points && points.length >= 2 && points[0].y !== 0
          ? ((points[points.length - 1].y - points[0].y) / Math.abs(points[0].y)) * 100
          : 0,
        dataPoints: points?.map((p) => ({ period: p.x, value: p.y, count: 1 })) || [],
      };
    });

  const warnings = dashboard.insights.filter((i) => i.type === "negative" || i.type === "warning");

  const overallGrowth = trends.length > 0
    ? trends.reduce((sum, t) => sum + t.changePercent, 0) / trends.length
    : 0;

  return {
    topPerformers,
    bottomPerformers,
    overallGrowth,
    keyTrends: trends,
    warnings,
    outliers: dashboard.insights
      .filter((i) => i.type === "warning")
      .map((i) => ({ column: i.metric || "", count: i.value || 0 })),
  };
}

export function formatSummaryForLLM(request: ExecutiveSummaryRequest): string {
  const parts: string[] = [];

  parts.push("=== VERIFIED BUSINESS DATA ===\n");

  if (request.topPerformers.length > 0) {
    parts.push("TOP PERFORMERS:");
    request.topPerformers.forEach((p) => {
      parts.push(`  - ${p.name}: ${p.value}`);
    });
    parts.push("");
  }

  if (request.bottomPerformers.length > 0) {
    parts.push("BOTTOM PERFORMERS:");
    request.bottomPerformers.forEach((p) => {
      parts.push(`  - ${p.name}: ${p.value}`);
    });
    parts.push("");
  }

  parts.push(`OVERALL GROWTH: ${request.overallGrowth.toFixed(1)}%`);
  parts.push("");

  if (request.keyTrends.length > 0) {
    parts.push("KEY TRENDS:");
    request.keyTrends.forEach((t) => {
      parts.push(`  - ${t.valueColumn}: ${t.direction} (${t.changePercent > 0 ? "+" : ""}${t.changePercent.toFixed(1)}%)`);
    });
    parts.push("");
  }

  if (request.warnings.length > 0) {
    parts.push("WARNINGS:");
    request.warnings.forEach((w) => {
      parts.push(`  - ${w.title}`);
    });
    parts.push("");
  }

  if (request.outliers.length > 0) {
    parts.push("OUTLIERS:");
    request.outliers.forEach((o) => {
      parts.push(`  - ${o.column}: ${o.count} outlier points`);
    });
  }

  return parts.join("\n");
}
