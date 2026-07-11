import type {
  DetectedIntent, AIResponse, DashboardJSON, DatasetMetadata,
  ColumnStatistics, RecommendedChart, BusinessInsight, AnalysisChart,
  RecommendationResult, ExecutiveBrief, DecisionSupport, HighlightAction, ExplainResult,
} from "@pulsebi/shared-types";
import { generateId, round, formatCurrency, formatNumber, percentile } from "@pulsebi/shared-utils";

export interface QueryEngineInput {
  intent: DetectedIntent;
  question: string;
  metadata: DatasetMetadata;
  columnStatistics: ColumnStatistics[];
  dashboard: DashboardJSON;
  rows: Record<string, unknown>[];
}

export function executeQuery(input: QueryEngineInput): AIResponse {
  const { intent, metadata, columnStatistics, dashboard, rows } = input;

  const numericCols = metadata.columns
    .filter((c) => c.role === "measure" && (c.detectedType === "integer" || c.detectedType === "decimal"))
    .map((c) => c.name);

  const dimensionCols = metadata.columns
    .filter((c) => c.role === "dimension" && c.detectedType !== "date" && c.detectedType !== "id" && (c.uniqueCount ?? 0) > 1)
    .map((c) => c.name);

  const dateCols = metadata.columns
    .filter((c) => c.detectedType === "date")
    .map((c) => c.name);

  const isDimensionCol = (name: string) =>
    metadata.columns.some((c) => c.name === name && (c.role === "dimension" || c.detectedType === "date" || c.detectedType === "id" || (c.uniqueCount ?? 0) > 20));

  function resolveMetric(): string | undefined {
    if (intent.metric && !isDimensionCol(intent.metric)) {
      const found = numericCols.find((c) => c.toLowerCase() === intent.metric!.toLowerCase())
        || numericCols.find((c) => c.toLowerCase().includes(intent.metric!.toLowerCase()));
      if (found) return found;
    }
    return numericCols[0];
  }

  function resolveDimension(): string | undefined {
    if (intent.dimension) {
      const all = metadata.columns.map((c) => c.name);
      const found = all.find((c) => c.toLowerCase() === intent.dimension!.toLowerCase())
        || all.find((c) => c.toLowerCase().includes(intent.dimension!.toLowerCase()));
      if (found) return found;
    }
    if (intent.metric && isDimensionCol(intent.metric)) {
      return intent.metric;
    }
    return dimensionCols[0] || metadata.columns.find((c) => c.role === "dimension")?.name;
  }

  function findLabelCol(): string {
    return dimensionCols[0] || metadata.columns.find((c) => c.role === "dimension")?.name || metadata.columns[0]?.name || "";
  }

  // ─── ROUTE BY INTENT LEVEL ────────────────────────────────────

  switch (intent.level) {
    case "information":
      return executeInformation(intent, input, { resolveMetric, resolveDimension, findLabelCol, numericCols, dimensionCols });
    case "analysis":
      return executeAnalysis(intent, input, { resolveMetric, resolveDimension, findLabelCol, numericCols, dimensionCols });
    case "recommendation":
      return executeRecommendation(intent, input, { numericCols, dimensionCols, dateCols });
    case "executive_brief":
      return executeExecutiveBrief(intent, input, { numericCols, dimensionCols });
    case "decision_support":
      return executeDecisionSupport(intent, input, { numericCols, dimensionCols });
    case "highlight":
      return executeHighlight(intent, input, { resolveMetric, resolveDimension, numericCols, dimensionCols });
    case "explain":
      return executeExplain(intent, input, { numericCols, dimensionCols, dateCols });
    case "dashboard_modification":
      return executeDashboardModification(intent, input, { resolveMetric, resolveDimension, isDimensionCol, numericCols, dimensionCols });
    default:
      return executeInformation(intent, input, { resolveMetric, resolveDimension, findLabelCol, numericCols, dimensionCols });
  }
}

// ═══════════════════════════════════════════════════════════════════
// MODE 1: INFORMATION — Answer only, no dashboard change
// ═══════════════════════════════════════════════════════════════════

function executeInformation(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; findLabelCol: () => string; numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { resolveMetric, resolveDimension, findLabelCol, numericCols } = ctx;
  const { metadata, columnStatistics, rows } = input;
  let answer = "";

  const cs = columnStatistics.find((s) => s.columnName === resolveMetric());

  switch (intent.type) {
    case "sum": {
      const col = resolveMetric();
      const stats = columnStatistics.find((s) => s.columnName === col);
      if (stats) {
        answer = `**${formatTitle(col!)}**: ${formatCurrency(stats.stats.sum)}`;
        const pctOfTotal = numericCols.length > 1
          ? `\n\nThis represents ${((stats.stats.sum / numericCols.reduce((s, c) => s + (columnStatistics.find((x) => x.columnName === c)?.stats.sum || 0), 0)) * 100).toFixed(1)}% of all numeric totals.`
          : "";
        answer += pctOfTotal;
      }
      break;
    }
    case "average": {
      const col = resolveMetric();
      const stats = columnStatistics.find((s) => s.columnName === col);
      if (stats) {
        answer = `**${formatTitle(col!)}** average: ${formatCurrency(stats.stats.avg)}\n\nMedian: ${formatCurrency(stats.stats.median)} (middle value across ${stats.stats.count} records)`;
      }
      break;
    }
    case "highest": {
      const col = resolveMetric();
      const dim = resolveDimension();
      const stats = columnStatistics.find((s) => s.columnName === col);
      if (stats && dim) {
        const grouped = aggregateByDimension(rows, dim, col!);
        const top = grouped[0];
        if (top) {
          answer = `**${top[dim]}** has the highest ${formatTitle(col!)} at ${formatCurrency(top.total as number)}`;
          if (grouped.length > 1) {
            const diff = ((top.total as number) - (grouped[1].total as number)) / (grouped[1].total as number) * 100;
            answer += `\n\nThis is ${diff.toFixed(0)}% higher than ${grouped[1][dim]} (${formatCurrency(grouped[1].total as number)})`;
          }
        }
      } else if (stats) {
        answer = `**Highest ${formatTitle(col!)}**: ${formatCurrency(stats.stats.max)}`;
      }
      break;
    }
    case "lowest": {
      const col = resolveMetric();
      const dim = resolveDimension();
      const stats = columnStatistics.find((s) => s.columnName === col);
      if (stats && dim) {
        const grouped = aggregateByDimension(rows, dim, col!);
        const bottom = grouped[grouped.length - 1];
        if (bottom) {
          answer = `**${bottom[dim]}** has the lowest ${formatTitle(col!)} at ${formatCurrency(bottom.total as number)}`;
        }
      } else if (stats) {
        answer = `**Lowest ${formatTitle(col!)}**: ${formatCurrency(stats.stats.min)}`;
      }
      break;
    }
    case "count": {
      answer = `**${rows.length}** records in this dataset`;
      break;
    }
    default: {
      const col = resolveMetric();
      const stats = columnStatistics.find((s) => s.columnName === col);
      if (stats) {
        answer = `**${formatTitle(col!)}**: ${formatCurrency(stats.stats.sum)}\n\nAcross ${stats.stats.count} records, ranging from ${formatCurrency(stats.stats.min)} to ${formatCurrency(stats.stats.max)}`;
      } else {
        answer = `Based on the data, I found ${rows.length} records across ${metadata.columns.length} columns.`;
      }
    }
  }

  return { intent, answer };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 2: ANALYSIS — Temporary analysis card + optional chart
// ═══════════════════════════════════════════════════════════════════

function executeAnalysis(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; findLabelCol: () => string; numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { resolveMetric, resolveDimension, findLabelCol, numericCols } = ctx;
  const { metadata, columnStatistics, rows } = input;

  let answer = "";
  let chart: RecommendedChart | undefined;
  const insights: BusinessInsight[] = [];
  const recommendations: string[] = [];

  switch (intent.type) {
    case "trend": {
      const col = resolveMetric();
      const dateCol = metadata.columns.find((c) => c.detectedType === "date")?.name;
      if (col && dateCol) {
        const timeSeries = aggregateByTime(rows, dateCol, col);
        chart = {
          id: generateId(), type: "line",
          title: `${formatTitle(col)} Over Time`,
          description: `Trend analysis for ${col.toLowerCase()}`,
          xAxis: dateCol, yAxis: col,
          dataSource: "analysis", priority: 1,
          config: { points: timeSeries },
        };
        const firstVal = timeSeries[0]?.y || 0;
        const lastVal = timeSeries[timeSeries.length - 1]?.y || 0;
        const change = firstVal > 0 ? ((lastVal - firstVal) / firstVal * 100) : 0;
        answer = `${formatTitle(col)} ${change >= 0 ? "increased" : "decreased"} by ${Math.abs(change).toFixed(1)}% over the period.`;
        insights.push({
          id: generateId(), type: change >= 0 ? "positive" : "negative",
          title: `${formatTitle(col)} Trend`, description: `${change >= 0 ? "Up" : "Down"} ${Math.abs(change).toFixed(1)}% overall`,
          metric: col, value: lastVal, severity: Math.abs(change) > 10 ? "high" : "medium",
        });
        recommendations.push(`Investigate the ${change >= 0 ? "growth drivers" : "root cause of decline"}`);
      }
      break;
    }
    case "compare": {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (col && dim) {
        const grouped = aggregateByDimension(rows, dim, col);
        chart = {
          id: generateId(), type: "bar",
          title: `${formatTitle(col)} by ${formatTitle(dim)}`,
          description: `Comparison across ${dim.toLowerCase()}`,
          xAxis: dim, yAxis: col, groupBy: dim,
          dataSource: "analysis", priority: 1,
          config: { data: grouped },
        };
        const max = grouped[0];
        const min = grouped[grouped.length - 1];
        if (max && min) {
          const diff = ((max.total as number) - (min.total as number)) / (min.total as number) * 100;
          answer = `Comparing ${formatTitle(col)} across ${formatTitle(dim)}:\n\n${max[dim]} leads at ${formatCurrency(max.total as number)}, which is ${diff.toFixed(0)}% higher than ${min[dim]} (${formatCurrency(min.total as number)}).`;
          insights.push({
            id: generateId(), type: "info", title: "Performance Gap",
            description: `${diff.toFixed(0)}% difference between highest and lowest`,
            severity: diff > 30 ? "high" : "medium",
          });
        }
      }
      break;
    }
    default: {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (col && dim) {
        const grouped = aggregateByDimension(rows, dim, col);
        chart = {
          id: generateId(), type: "bar",
          title: `${formatTitle(col)} by ${formatTitle(dim)}`,
          description: `Breakdown of ${col.toLowerCase()} across ${dim.toLowerCase()}`,
          xAxis: dim, yAxis: col, groupBy: dim,
          dataSource: "analysis", priority: 1,
          config: { data: grouped },
        };
        answer = `${formatTitle(col)} by ${formatTitle(dim)}:\n` + grouped.map((g) => `  ${g[dim]}: ${formatCurrency(g.total as number)}`).join("\n");
      } else {
        answer = `Analysis: ${rows.length} records analyzed.`;
      }
    }
  }

  const analysis: AnalysisChart | undefined = chart ? {
    id: generateId(), chart, insights, recommendations,
  } : undefined;

  return { intent, answer, analysis };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 3: RECOMMENDATION — Business priorities + expected impact
// ═══════════════════════════════════════════════════════════════════

function executeRecommendation(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { numericCols: string[]; dimensionCols: string[]; dateCols: string[] }
): AIResponse {
  const { columnStatistics, dashboard, rows } = input;
  const priorities: RecommendationResult["priorities"] = [];

  // Find weakest dimension performer
  for (const dim of ctx.dimensionCols.slice(0, 2)) {
    const col = ctx.numericCols[0];
    if (!col) continue;
    const grouped = aggregateByDimension(rows, dim, col);
    if (grouped.length >= 2) {
      const bottom = grouped[grouped.length - 1];
      const top = grouped[0];
      const gap = ((top.total as number) - (bottom.total as number)) / (top.total as number) * 100;
      if (gap > 15) {
        priorities.push({
          title: `Improve ${bottom[dim]} ${formatTitle(col)}`,
          description: `${bottom[dim]} is ${gap.toFixed(0)}% behind ${top[dim]}. Focus on closing this gap.`,
          impact: gap > 40 ? "high" : "medium",
          metric: col,
          currentValue: formatCurrency(bottom.total as number),
        });
      }
    }
  }

  // Find declining metrics
  for (const cs of columnStatistics.filter((s) => ctx.numericCols.includes(s.columnName)).slice(0, 2)) {
    if (cs.stats.stdDev > cs.stats.avg * 0.3) {
      priorities.push({
        title: `Stabilize ${formatTitle(cs.columnName)}`,
        description: `High variability (σ=${formatCurrency(cs.stats.stdDev)}) suggests inconsistent performance.`,
        impact: "medium",
        metric: cs.columnName,
        currentValue: `Avg: ${formatCurrency(cs.stats.avg)}`,
      });
    }
  }

  // If no specific findings, provide general guidance
  if (priorities.length === 0) {
    priorities.push({
      title: "Monitor key metrics",
      description: "Current performance is stable. Continue tracking trends.",
      impact: "low",
    });
  }

  const highImpactCount = priorities.filter((p) => p.impact === "high").length;
  const result: RecommendationResult = {
    title: "Business Priorities",
    priorities: priorities.slice(0, 4),
    expectedImpact: highImpactCount > 0 ? "high" : "medium",
    reasoning: `Based on analysis of ${rows.length} records across ${ctx.dimensionCols.length} dimensions.`,
  };

  const answer = priorities.map((p, i) =>
    `${i + 1}. **${p.title}** — ${p.description}`
  ).join("\n\n");

  return { intent, answer, recommendation: result };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 4: EXECUTIVE BRIEF — CEO-style brief with metrics
// ═══════════════════════════════════════════════════════════════════

function executeExecutiveBrief(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { columnStatistics, dashboard, rows } = input;

  const metrics: ExecutiveBrief["metrics"] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];

  // Build metrics from KPIs and column statistics
  for (const kpi of dashboard.kpis.slice(0, 4)) {
    metrics.push({
      label: kpi.title,
      value: kpi.formattedValue,
      change: kpi.changePercent,
      direction: kpi.trend,
    });
  }

  // Fallback if no KPIs
  if (metrics.length === 0) {
    for (const cs of columnStatistics.filter((s) => ctx.numericCols.includes(s.columnName)).slice(0, 4)) {
      metrics.push({
        label: formatTitle(cs.columnName),
        value: formatCurrency(cs.stats.sum),
        direction: cs.stats.avg > cs.stats.median ? "up" : "down",
      });
    }
  }

  // Identify risks (negative insights)
  const negInsights = dashboard.insights.filter((i) => i.type === "negative" || i.type === "warning");
  for (const ins of negInsights.slice(0, 2)) {
    risks.push(`${ins.title}: ${ins.description}`);
  }
  if (risks.length === 0) risks.push("No significant risks detected");

  // Identify opportunities (positive insights + top performers)
  const posInsights = dashboard.insights.filter((i) => i.type === "positive");
  for (const ins of posInsights.slice(0, 2)) {
    opportunities.push(`${ins.title}: ${ins.description}`);
  }
  if (opportunities.length === 0 && dashboard.kpis.length > 0) {
    const topKpi = dashboard.kpis.reduce((best, kpi) =>
      (kpi.changePercent ?? 0) > (best.changePercent ?? 0) ? kpi : best, dashboard.kpis[0]);
    if (topKpi.changePercent && topKpi.changePercent > 0) {
      opportunities.push(`${topKpi.title} showing strong growth (+${topKpi.changePercent.toFixed(1)}%)`);
    }
  }

  const result: ExecutiveBrief = {
    title: "Executive Brief",
    metrics,
    risks,
    opportunities,
    recommendation: risks[0] !== "No significant risks detected"
      ? `Investigate: ${risks[0].split(":")[0]}`
      : "Continue current trajectory",
  };

  const metricsStr = metrics.map((m) =>
    `**${m.label}**: ${m.value}${m.change !== undefined ? ` (${m.direction === "up" ? "↑" : "↓"}${Math.abs(m.change).toFixed(1)}%)` : ""}`
  ).join("\n");

  const answer = `${metricsStr}\n\n**Risks**: ${risks.join("; ")}\n\n**Opportunities**: ${opportunities.join("; ")}\n\n**Recommendation**: ${result.recommendation}`;

  return { intent, answer, executiveBrief: result };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 5: DECISION SUPPORT — Data-backed decision with confidence
// ═══════════════════════════════════════════════════════════════════

function executeDecisionSupport(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { columnStatistics, dashboard, rows, metadata } = input;

  const factors: DecisionSupport["factors"] = [];
  const metric = intent.metric || ctx.numericCols[0];
  const cs = columnStatistics.find((s) => s.columnName === metric);

  if (cs) {
    factors.push({
      label: formatTitle(metric),
      value: formatCurrency(cs.stats.sum),
      direction: cs.stats.avg > cs.stats.median ? "up" : "down",
    });
    factors.push({
      label: "Average",
      value: formatCurrency(cs.stats.avg),
    });
    factors.push({
      label: "Consistency",
      value: cs.stats.cv < 0.3 ? "Stable" : "Volatile",
    });
  }

  // Check if there's a positive trend
  const dim = ctx.dimensionCols[0];
  if (dim && metric) {
    const grouped = aggregateByDimension(rows, dim, metric);
    if (grouped.length >= 2) {
      const top = grouped[0];
      factors.push({
        label: `Top ${formatTitle(dim)}`,
        value: `${top[dim]} (${formatCurrency(top.total as number)})`,
        direction: "up",
      });
    }
  }

  // Determine verdict based on data
  let verdict: DecisionSupport["verdict"] = "conditional";
  let confidence: DecisionSupport["confidence"] = "medium";
  const positiveFactors = factors.filter((f) => f.direction === "up").length;
  const totalFactors = factors.length;

  if (positiveFactors / totalFactors > 0.6) {
    verdict = "yes";
    confidence = totalFactors >= 3 ? "high" : "medium";
  } else if (positiveFactors / totalFactors < 0.3) {
    verdict = "no";
    confidence = totalFactors >= 3 ? "high" : "medium";
  }

  const result: DecisionSupport = {
    title: "Decision Support",
    question: input.question,
    verdict,
    confidence,
    factors,
    reasoning: `Based on ${totalFactors} data factors, ${positiveFactors} indicate positive trends.`,
  };

  const verdictText = verdict === "yes" ? "Appears favorable" : verdict === "no" ? "May not be advisable" : "Requires further analysis";
  const answer = `**${verdictText}** (Confidence: ${confidence})\n\n` +
    factors.map((f) => `**${f.label}**: ${f.value}${f.direction ? ` (${f.direction === "up" ? "↑" : "↓"})` : ""}`).join("\n") +
    `\n\n${result.reasoning}`;

  return { intent, answer, decisionSupport: result };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 6: HIGHLIGHT — Point to existing chart, glow effect
// ═══════════════════════════════════════════════════════════════════

function executeHighlight(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { resolveMetric, resolveDimension } = ctx;
  const { dashboard, columnStatistics, rows } = input;

  // Find the best matching existing chart
  const metric = resolveMetric();
  const dim = resolveDimension();
  let matchedChart = dashboard.charts.find((c) => {
    const titleLower = c.title.toLowerCase();
    if (metric && titleLower.includes(metric.toLowerCase())) return true;
    if (dim && titleLower.includes(dim.toLowerCase())) return true;
    return false;
  });

  // Fallback to first chart if no match
  if (!matchedChart && dashboard.charts.length > 0) {
    matchedChart = dashboard.charts[0];
  }

  if (!matchedChart) {
    return {
      intent,
      answer: "No existing charts to highlight. Try asking me to create one first.",
    };
  }

  // Find the best performer in the highlighted chart's data
  const data = matchedChart.config.data as { name: string; value: number }[] | undefined;
  const points = matchedChart.config.points as { x: string; y: number }[] | undefined;

  let highlightData: { label: string; value: string }[] = [];
  let insight = "";

  if (data && data.length > 0) {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    highlightData = [{ label: "Best", value: `${best.name}: ${formatCurrency(best.value)}` }];
    if (sorted.length > 1) {
      const diff = ((best.value - worst.value) / worst.value * 100).toFixed(0);
      insight = `${best.name} leads with ${formatCurrency(best.value)}, ${diff}% higher than ${worst.name}.`;
    }
  } else if (points && points.length > 0) {
    const sorted = [...points].sort((a, b) => b.y - a.y);
    const best = sorted[0];
    highlightData = [{ label: "Peak", value: `${best.x}: ${formatCurrency(best.y)}` }];
    insight = `Peak value of ${formatCurrency(best.y)} at ${best.x}.`;
  }

  const result: HighlightAction = {
    chartId: matchedChart.id,
    chartTitle: matchedChart.title,
    highlightData,
    Insight: insight || `Highlighting ${matchedChart.title}.`,
  };

  return {
    intent,
    answer: `**${matchedChart.title}**\n\n${insight || "Here's the chart you asked about."}`,
    highlight: result,
  };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 7: EXPLAIN — Text-only explanation (no chart)
// ═══════════════════════════════════════════════════════════════════

function executeExplain(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { numericCols: string[]; dimensionCols: string[]; dateCols: string[] }
): AIResponse {
  const { columnStatistics, rows, dashboard } = input;

  const col = intent.metric || ctx.numericCols[0];
  const cs = columnStatistics.find((s) => s.columnName === col);

  const causes: string[] = [];
  let recommendation = "";

  if (cs) {
    // Analyze distribution for seasonality / patterns
    if (cs.stats.cv > 0.4) {
      causes.push("High variability suggests inconsistent performance across periods");
    }
    if (cs.stats.outliers > 0) {
      causes.push(`${cs.stats.outliers} outlier values detected (range: ${formatCurrency(cs.stats.min)} to ${formatCurrency(cs.stats.max)})`);
    }
    if (cs.topValues && cs.topValues.length > 0) {
      const topContributor = cs.topValues[0];
      causes.push(`${topContributor.name} contributes ${topContributor.percentage.toFixed(0)}% of total ${formatTitle(col)}`);
    }

    // Check for trend via dimension grouping
    const dim = ctx.dimensionCols[0];
    if (dim) {
      const grouped = aggregateByDimension(rows, dim, col);
      if (grouped.length >= 2) {
        const top = grouped[0];
        const bottom = grouped[grouped.length - 1];
        causes.push(`${top[dim]} leads with ${formatCurrency(top.total as number)}, while ${bottom[dim]} trails at ${formatCurrency(bottom.total as number)}`);
      }
    }
  }

  if (causes.length === 0) {
    causes.push(`Based on ${rows.length} records, the data shows normal distribution`);
  }

  recommendation = `Review the factors above to identify actionable improvements.`;

  const result: ExplainResult = {
    title: `Explaining ${formatTitle(col || "metric")}`,
    explanation: causes.join(". "),
    causes,
    recommendation,
  };

  const answer = `**${result.title}**\n\n**Possible causes:**\n${causes.map((c) => `• ${c}`).join("\n")}\n\n**Recommendation:** ${recommendation}`;

  return { intent, answer, explain: result };
}

// ═══════════════════════════════════════════════════════════════════
// MODE 8: DASHBOARD MODIFICATION — Permanent change
// ═══════════════════════════════════════════════════════════════════

function executeDashboardModification(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; isDimensionCol: (name: string) => boolean; numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { resolveMetric, resolveDimension, isDimensionCol } = ctx;
  const { metadata, columnStatistics, dashboard, rows } = input;
  let answer = "";
  let dashboardPatch: Partial<DashboardJSON> | undefined;

  switch (intent.type) {
    case "chart_add": {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (col && dim) {
        const grouped = aggregateByDimension(rows, dim, col);
        const newChart: RecommendedChart = {
          id: generateId(), type: "bar",
          title: `${formatTitle(col)} by ${formatTitle(dim)}`,
          description: `Added via conversation`,
          xAxis: dim, yAxis: col, groupBy: dim,
          dataSource: "dashboard_modification", priority: dashboard.charts.length + 1,
          config: { data: grouped },
        };
        dashboardPatch = { charts: [...dashboard.charts, newChart] };
        answer = `Added "${newChart.title}" chart to your dashboard.`;
      } else {
        answer = "Could not determine what chart to add. Please specify a metric and dimension.";
      }
      break;
    }
    case "chart_remove": {
      const metricName = intent.metric || intent.dimension;
      if (metricName) {
        const filtered = dashboard.charts.filter((c) =>
          !c.title.toLowerCase().includes(metricName.toLowerCase()) &&
          c.yAxis?.toLowerCase() !== metricName.toLowerCase()
        );
        const removed = dashboard.charts.length - filtered.length;
        if (removed > 0) {
          dashboardPatch = { charts: filtered };
          answer = `Removed ${removed} chart(s) related to "${metricName}" from your dashboard.`;
        } else {
          answer = `No charts found matching "${metricName}" to remove.`;
        }
      } else {
        answer = "Please specify which chart to remove.";
      }
      break;
    }
    case "chart_replace": {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (col && dim) {
        const grouped = aggregateByDimension(rows, dim, col);
        const newChart: RecommendedChart = {
          id: generateId(), type: "bar",
          title: `${formatTitle(col)} by ${formatTitle(dim)}`,
          description: `Replaced via conversation`,
          xAxis: dim, yAxis: col, groupBy: dim,
          dataSource: "dashboard_modification", priority: 1,
          config: { data: grouped },
        };
        const filtered = dashboard.charts.filter((c) => c.yAxis !== col);
        dashboardPatch = { charts: [...filtered, newChart] };
        answer = `Replaced chart with "${newChart.title}".`;
      } else {
        answer = "Could not determine replacement chart. Please specify a metric.";
      }
      break;
    }
    case "kpi_add": {
      const col = resolveMetric();
      const dimCol = resolveDimension();
      // If the user mentioned a dimension name (like "Customer"), treat it as a chart_add instead
      if (intent.metric && isDimensionCol(intent.metric) && dimCol) {
        const grouped = aggregateByDimension(rows, dimCol, col!);
        const newChart: RecommendedChart = {
          id: generateId(), type: "bar",
          title: `${formatTitle(col!)} by ${formatTitle(dimCol)}`,
          description: `Added via conversation`,
          xAxis: dimCol, yAxis: col, groupBy: dimCol,
          dataSource: "dashboard_modification", priority: dashboard.charts.length + 1,
          config: { data: grouped },
        };
        dashboardPatch = { charts: [...dashboard.charts, newChart] };
        answer = `Added "${newChart.title}" chart to your dashboard.`;
      } else if (col) {
        const cs = columnStatistics.find((s) => s.columnName === col);
        if (cs) {
          const newKpi = {
            id: generateId(), title: formatTitle(col),
            value: cs.stats.sum, formattedValue: formatCurrency(cs.stats.sum),
            format: "currency" as const, description: `Total ${col}`,
          };
          dashboardPatch = { kpis: [...dashboard.kpis, newKpi] };
          answer = `Added "${col}" KPI to your dashboard.`;
        }
      } else {
        answer = "Please specify which numeric metric to add as a KPI.";
      }
      break;
    }
    case "kpi_remove": {
      const metricName = intent.metric || intent.dimension;
      if (metricName) {
        const filtered = dashboard.kpis.filter((k) =>
          !k.title.toLowerCase().includes(metricName.toLowerCase())
        );
        const removed = dashboard.kpis.length - filtered.length;
        if (removed > 0) {
          dashboardPatch = { kpis: filtered };
          answer = `Removed ${removed} KPI(s) related to "${metricName}".`;
        } else {
          answer = `No KPIs found matching "${metricName}".`;
        }
      } else {
        answer = "Please specify which KPI to remove.";
      }
      break;
    }
    default: {
      answer = "Dashboard modification acknowledged. Please specify the exact change you'd like.";
    }
  }

  return { intent, answer, dashboardPatch };
}

// ═══════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════

function aggregateByDimension(rows: Record<string, unknown>[], dimCol: string, valCol: string): Record<string, unknown>[] {
  const map = new Map<string, number[]>();
  for (const row of rows) {
    const key = String(row[dimCol] || "Unknown");
    const val = Number(row[valCol]);
    if (!isNaN(val)) {
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(val);
    }
  }
  return [...map.entries()]
    .map(([name, vals]) => ({ [dimCol]: name, total: round(vals.reduce((a, b) => a + b, 0)), count: vals.length }))
    .sort((a, b) => (b.total as number) - (a.total as number));
}

function aggregateByTime(rows: Record<string, unknown>[], dateCol: string, valCol: string): { x: string; y: number }[] {
  const map = new Map<string, number[]>();
  for (const row of rows) {
    const raw = String(row[dateCol] || "");
    const date = new Date(raw);
    const key = isNaN(date.getTime()) ? raw.slice(0, 7) : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const val = Number(row[valCol]);
    if (!isNaN(val)) {
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(val);
    }
  }
  return [...map.entries()]
    .map(([period, vals]) => ({ x: period, y: round(vals.reduce((a, b) => a + b, 0)) }))
    .sort((a, b) => a.x.localeCompare(b.x));
}

function formatTitle(name: string): string {
  return name.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function formatVal(n: number): string {
  if (Math.abs(n) >= 1_000_000) return formatCurrency(n);
  if (Math.abs(n) >= 1000) return formatCurrency(n);
  return formatNumber(n);
}
