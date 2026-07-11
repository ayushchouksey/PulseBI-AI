import type {
  DetectedIntent, AIResponse, DashboardJSON, DatasetMetadata,
  ColumnStatistics, RecommendedChart, BusinessInsight, AnalysisChart,
} from "@pulsebi/shared-types";
import { generateId, round, formatCurrency, formatNumber } from "@pulsebi/shared-utils";

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
    .filter((c) => c.role === "dimension" && c.detectedType !== "date" && c.detectedType !== "id" && c.uniqueCount > 1)
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

  // ─── INFORMATION: answer only, no chart, no dashboard change ───
  if (intent.level === "information") {
    return executeInformation(intent, { resolveMetric, resolveDimension, findLabelCol, numericCols, metadata, columnStatistics, dashboard, rows });
  }

  // ─── ANALYSIS: answer + temporary chart + insights ───
  if (intent.level === "analysis") {
    return executeAnalysis(intent, input, { resolveMetric, resolveDimension, findLabelCol, numericCols, dimensionCols });
  }

  // ─── DASHBOARD_MODIFICATION: answer + dashboard patch ───
  return executeDashboardModification(intent, input, { resolveMetric, resolveDimension, findLabelCol, numericCols, dimensionCols });
}

function executeInformation(
  intent: DetectedIntent,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; findLabelCol: () => string; numericCols: string[]; metadata: DatasetMetadata; columnStatistics: ColumnStatistics[]; dashboard: DashboardJSON; rows: Record<string, unknown>[] }
): AIResponse {
  const { resolveMetric, resolveDimension, findLabelCol, metadata, columnStatistics, dashboard, rows } = ctx;
  let answer = "";

  switch (intent.type) {
    case "highest":
    case "top": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found to analyze."; break; }
      const limit = intent.limit || 5;
      const sorted = [...rows].sort((a, b) => Number(b[col]) - Number(a[col]));
      const data = sorted.slice(0, limit);
      const labelCol = findLabelCol();
      answer = `Top ${limit} by ${col}:\n` +
        data.map((r, i) => `${i + 1}. ${r[labelCol] || "N/A"} — ${col}: ${formatVal(Number(r[col]))}`).join("\n");
      break;
    }
    case "lowest":
    case "bottom": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found to analyze."; break; }
      const limit = intent.limit || 5;
      const sorted = [...rows].sort((a, b) => Number(a[col]) - Number(b[col]));
      const data = sorted.slice(0, limit);
      const labelCol = findLabelCol();
      answer = `Bottom ${limit} by ${col}:\n` +
        data.map((r, i) => `${i + 1}. ${r[labelCol] || "N/A"} — ${col}: ${formatVal(Number(r[col]))}`).join("\n");
      break;
    }
    case "average": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found."; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      answer = `The average ${col} is ${formatVal(cs?.stats.avg ?? 0)} (across ${cs?.stats.count ?? rows.length} records).`;
      break;
    }
    case "count": {
      const col = resolveMetric();
      answer = col ? `Total count of ${col}: ${columnStatistics.find((s) => s.columnName === col)?.stats.count ?? rows.length}` : `Total records: ${rows.length}`;
      break;
    }
    case "sum": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found."; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      answer = `Total sum of ${col}: ${formatVal(cs?.stats.sum ?? 0)}`;
      break;
    }
    case "explain": {
      const col = resolveMetric();
      if (!col) { answer = `Dataset: ${rows.length} records, ${metadata.columns.length} columns.`; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      if (cs) {
        answer = `${col} summary:\n  Count: ${cs.stats.count}\n  Sum: ${formatVal(cs.stats.sum)}\n  Average: ${formatVal(cs.stats.avg)}\n  Median: ${formatVal(cs.stats.median)}\n  Min: ${formatVal(cs.stats.min)}\n  Max: ${formatVal(cs.stats.max)}\n  Outliers: ${cs.stats.outliers}`;
      } else {
        answer = `No statistics available for "${col}".`;
      }
      break;
    }
    case "summary": {
      const parts: string[] = [`Dataset: ${metadata.rowCount} records, ${metadata.columnCount} columns.`];
      const measures = metadata.columns.filter((c) => c.role === "measure");
      for (const m of measures.slice(0, 3)) {
        const cs = columnStatistics.find((s) => s.columnName === m.name);
        if (cs) parts.push(`${m.name}: total ${formatVal(cs.stats.sum)}, avg ${formatVal(cs.stats.avg)}`);
      }
      answer = parts.join("\n");
      break;
    }
    default: {
      const col = intent.metric || intent.dimension;
      if (col) {
        const cs = columnStatistics.find((s) => s.columnName === col);
        if (cs) {
          answer = `${col}:\n  Count: ${cs.stats.count}\n  Avg: ${formatVal(cs.stats.avg)}\n  Min: ${formatVal(cs.stats.min)}\n  Max: ${formatVal(cs.stats.max)}`;
        } else {
          answer = `Column "${col}" not found. Available: ${metadata.columns.map((c) => c.name).join(", ")}`;
        }
      } else {
        answer = `Dataset has ${rows.length} records with ${metadata.columns.length} columns.`;
      }
    }
  }

  return { intent, answer };
}

function executeAnalysis(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; findLabelCol: () => string; numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { resolveMetric, resolveDimension, dimensionCols } = ctx;
  const { metadata, columnStatistics, dashboard, rows } = input;
  let answer = "";
  let chart: RecommendedChart | undefined;
  const insights: BusinessInsight[] = [];
  const recommendations: string[] = [];

  switch (intent.type) {
    case "compare": {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (!col || !dim) { answer = "Unable to determine comparison columns."; break; }
      const grouped = aggregateByDimension(rows, dim, col);
      answer = `${col} by ${dim}:\n` + grouped.map((g) => `  ${g[dim]}: ${formatVal(g.total as number)}`).join("\n");

      chart = {
        id: generateId(),
        type: grouped.length <= 6 ? "pie" : "bar",
        title: `${formatTitle(col)} by ${formatTitle(dim)}`,
        description: `Comparison of ${col} across ${dim}`,
        xAxis: dim, yAxis: col, groupBy: dim,
        dataSource: "analysis", priority: 1,
        config: { data: grouped },
      };

      if (grouped.length >= 2) {
        const top = grouped[0];
        const bottom = grouped[grouped.length - 1];
        insights.push({
          id: generateId(), type: "info",
          title: `${top[dim]} leads with ${formatVal(top.total as number)}`,
          description: `${bottom[dim]} has the lowest at ${formatVal(bottom.total as number)}`,
          severity: "medium",
        });
        recommendations.push(`Investigate why ${bottom[dim]} underperforms`);
      }
      break;
    }
    case "trend": {
      const col = intent.metric || resolveMetric();
      if (!col) { answer = "No metric specified for trend analysis."; break; }
      const trendChart = dashboard.charts.find((c) => c.type === "line" && c.yAxis === col);
      if (trendChart) {
        const points = trendChart.config?.points as { x: string; y: number }[];
        if (points && points.length >= 2) {
          const change = ((points[points.length - 1].y - points[0].y) / Math.abs(points[0].y || 1)) * 100;
          answer = `Trend for ${col}: ${change > 0 ? "+" : ""}${change.toFixed(1)}% change over time.`;
          chart = {
            id: generateId(), type: "line",
            title: `${formatTitle(col)} Trend`,
            description: `${change > 0 ? "Increasing" : "Decreasing"} trend over time`,
            xAxis: "Period", yAxis: col,
            dataSource: "analysis", priority: 1,
            config: { points },
          };
        } else {
          answer = `Limited data points for ${col} trend.`;
        }
      } else {
        answer = `No trend data available for ${col || "this metric"}.`;
      }
      break;
    }
    case "explain": {
      const col = resolveMetric();
      if (!col) { answer = `Dataset: ${rows.length} records.`; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      if (cs) {
        answer = `${col} detailed analysis:\n  Range: ${formatVal(cs.stats.min)} to ${formatVal(cs.stats.max)}\n  Average: ${formatVal(cs.stats.avg)}\n  Median: ${formatVal(cs.stats.median)}\n  Standard Deviation: ${formatVal(cs.stats.stdDev)}\n  Outliers: ${cs.stats.outliers}`;

        if (cs.stats.outliers > 0) {
          insights.push({
            id: generateId(), type: "warning",
            title: `${cs.stats.outliers} outlier(s) detected in ${col}`,
            description: `Values outside IQR range: ${cs.stats.outlierValues.slice(0, 5).map(formatVal).join(", ")}`,
            metric: col, value: cs.stats.outliers, severity: "high",
          });
          recommendations.push(`Review the ${cs.stats.outliers} outlier data points in ${col}`);
        }

        if (cs.histogram && cs.histogram.length > 0) {
          chart = {
            id: generateId(), type: "histogram",
            title: `Distribution of ${formatTitle(col)}`,
            description: `Value distribution for ${col}`,
            xAxis: col, dataSource: "analysis", priority: 1,
            config: { bins: cs.histogram },
          };
        }
      }
      break;
    }
    default: {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (col && dim) {
        const grouped = aggregateByDimension(rows, dim, col);
        answer = `${col} by ${dim}:\n` + grouped.map((g) => `  ${g[dim]}: ${formatVal(g.total as number)}`).join("\n");
        chart = {
          id: generateId(), type: "bar",
          title: `${formatTitle(col)} by ${formatTitle(dim)}`,
          description: `Breakdown of ${col} across ${dim}`,
          xAxis: dim, yAxis: col, groupBy: dim,
          dataSource: "analysis", priority: 1,
          config: { data: grouped },
        };
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

function executeDashboardModification(
  intent: DetectedIntent,
  input: QueryEngineInput,
  ctx: { resolveMetric: () => string | undefined; resolveDimension: () => string | undefined; findLabelCol: () => string; numericCols: string[]; dimensionCols: string[] }
): AIResponse {
  const { resolveMetric, resolveDimension } = ctx;
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
      if (col) {
        const cs = columnStatistics.find((s) => s.columnName === col);
        if (cs) {
          const newKpi = {
            id: generateId(), title: formatTitle(col),
            value: cs.stats.sum, formattedValue: formatVal(cs.stats.sum),
            format: "number" as const, description: `Total ${col}`,
          };
          dashboardPatch = { kpis: [...dashboard.kpis, newKpi] };
          answer = `Added "${col}" KPI to your dashboard.`;
        }
      } else {
        answer = "Please specify which metric to add as a KPI.";
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

function formatTitle(name: string): string {
  return name.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function formatVal(n: number): string {
  if (Math.abs(n) >= 1_000_000) return formatCurrency(n);
  if (Math.abs(n) >= 1000) return formatCurrency(n);
  return formatNumber(n);
}
