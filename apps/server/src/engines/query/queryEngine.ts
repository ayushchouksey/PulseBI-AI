import type { DetectedIntent, QueryResult, DashboardJSON, DatasetMetadata, ColumnStatistics } from "@pulsebi/shared-types";
import { round, formatCurrency, formatNumber } from "@pulsebi/shared-utils";

export interface QueryEngineInput {
  intent: DetectedIntent;
  question: string;
  metadata: DatasetMetadata;
  columnStatistics: ColumnStatistics[];
  dashboard: DashboardJSON;
  rows: Record<string, unknown>[];
}

export function executeQuery(input: QueryEngineInput): QueryResult {
  const { intent, metadata, columnStatistics, dashboard, rows } = input;

  let answer = "";
  let data: Record<string, unknown>[] = [];

  const numericCols = metadata.columns
    .filter((c) => c.role === "measure" && (c.detectedType === "integer" || c.detectedType === "decimal"))
    .map((c) => c.name);

  const dimensionCols = metadata.columns
    .filter((c) => c.role === "dimension" && c.detectedType !== "date" && c.detectedType !== "id" && c.uniqueCount > 1)
    .map((c) => c.name);

  function resolveMetric(): string | undefined {
    if (intent.metric) {
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
    return dimensionCols[0] || metadata.columns.find((c) => c.role === "dimension")?.name;
  }

  function findLabelCol(): string {
    return dimensionCols[0] || metadata.columns.find((c) => c.role === "dimension")?.name || metadata.columns[0]?.name || "";
  }

  switch (intent.type) {
    case "highest":
    case "top": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found to analyze."; break; }
      const limit = intent.limit || 5;
      const sorted = [...rows].sort((a, b) => Number(b[col]) - Number(a[col]));
      data = sorted.slice(0, limit);
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
      data = sorted.slice(0, limit);
      const labelCol = findLabelCol();
      answer = `Bottom ${limit} by ${col}:\n` +
        data.map((r, i) => `${i + 1}. ${r[labelCol] || "N/A"} — ${col}: ${formatVal(Number(r[col]))}`).join("\n");
      break;
    }

    case "average": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found."; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      const avg = cs?.stats.avg ?? 0;
      answer = `The average ${col} is ${formatVal(avg)} (across ${cs?.stats.count ?? rows.length} records).`;
      data = [{ metric: col, average: avg, count: cs?.stats.count }];
      break;
    }

    case "count": {
      const col = resolveMetric();
      if (!col) { answer = `Total records: ${rows.length}`; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      answer = `Total count of ${col}: ${cs?.stats.count ?? rows.length}`;
      data = [{ metric: col, count: cs?.stats.count ?? rows.length }];
      break;
    }

    case "sum": {
      const col = resolveMetric();
      if (!col) { answer = "No numeric column found."; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      const sum = cs?.stats.sum ?? 0;
      answer = `Total sum of ${col}: ${formatVal(sum)}`;
      data = [{ metric: col, sum }];
      break;
    }

    case "compare": {
      const col = resolveMetric();
      const dim = resolveDimension();
      if (!col || !dim) { answer = "Unable to determine comparison columns."; break; }
      const grouped = groupBy(rows, dim, col);
      data = grouped;
      answer = `${col} by ${dim}:\n` +
        grouped.map((g) => `  ${g[dim]}: ${formatVal(g.total as number)}`).join("\n");
      break;
    }

    case "trend": {
      const col = intent.metric || resolveMetric();
      const trendChart = dashboard.charts.find((c) => c.type === "line" && c.yAxis === col);
      if (trendChart) {
        const points = trendChart.config?.points as { x: string; y: number }[];
        if (points && points.length >= 2) {
          const change = ((points[points.length - 1].y - points[0].y) / Math.abs(points[0].y || 1)) * 100;
          answer = `Trend for ${col}: ${change > 0 ? "+" : ""}${change.toFixed(1)}% change over time.`;
        } else {
          answer = `Trend for ${col}: Limited data points available.`;
        }
        data = points || [];
      } else {
        answer = `No trend data available for ${col || "this metric"}.`;
      }
      break;
    }

    case "explain": {
      const col = resolveMetric();
      if (!col) { answer = `Dataset overview: ${rows.length} records, ${metadata.columns.length} columns.`; break; }
      const cs = columnStatistics.find((s) => s.columnName === col);
      if (cs) {
        answer = `${col} summary:\n` +
          `  Count: ${cs.stats.count}\n` +
          `  Sum: ${formatVal(cs.stats.sum)}\n` +
          `  Average: ${formatVal(cs.stats.avg)}\n` +
          `  Median: ${formatVal(cs.stats.median)}\n` +
          `  Min: ${formatVal(cs.stats.min)}\n` +
          `  Max: ${formatVal(cs.stats.max)}\n` +
          `  Std Dev: ${formatVal(cs.stats.stdDev)}\n` +
          `  Outliers: ${cs.stats.outliers}`;
        data = [{ ...cs.stats, columnName: cs.columnName } as unknown as Record<string, unknown>];
      } else {
        answer = `No detailed statistics available for "${col}".`;
      }
      break;
    }

    case "summary": {
      answer = buildQuickSummary(metadata, dashboard, columnStatistics);
      break;
    }

    case "recommendation": {
      answer = buildRecommendations(dashboard, columnStatistics);
      break;
    }

    default: {
      const col = intent.metric || intent.dimension;
      if (col) {
        const cs = columnStatistics.find((s) => s.columnName === col);
        if (cs) {
          answer = `${col}:\n  Count: ${cs.stats.count}\n  Avg: ${formatVal(cs.stats.avg)}\n  Min: ${formatVal(cs.stats.min)}\n  Max: ${formatVal(cs.stats.max)}`;
          data = [cs.stats as unknown as Record<string, unknown>];
        } else {
          answer = `Column "${col}" not found. Available columns: ${metadata.columns.map((c) => c.name).join(", ")}`;
        }
      } else {
        answer = `Dataset has ${rows.length} records with ${metadata.columns.length} columns.\n` +
          `Columns: ${metadata.columns.map((c) => `${c.name} (${c.role})`).join(", ")}`;
      }
    }
  }

  return { intent, answer, data };
}

function findFirstMeasure(metadata: DatasetMetadata): string | undefined {
  return metadata.columns.find((c) => c.role === "measure" && (c.detectedType === "integer" || c.detectedType === "decimal"))?.name;
}

function groupBy(rows: Record<string, unknown>[], dimCol: string, valCol: string): Record<string, unknown>[] {
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

function buildQuickSummary(
  metadata: DatasetMetadata,
  dashboard: DashboardJSON,
  columnStatistics: ColumnStatistics[]
): string {
  const parts: string[] = [];
  parts.push(`Dataset: ${metadata.rowCount} records, ${metadata.columnCount} columns.`);

  const measures = metadata.columns.filter((c) => c.role === "measure");
  for (const m of measures.slice(0, 3)) {
    const cs = columnStatistics.find((s) => s.columnName === m.name);
    if (cs) parts.push(`${m.name}: total ${formatVal(cs.stats.sum)}, avg ${formatVal(cs.stats.avg)}`);
  }

  if (dashboard.kpis.length > 0) {
    const topKpi = dashboard.kpis[0];
    parts.push(`Primary KPI: ${topKpi.title} = ${topKpi.formattedValue}`);
  }

  return parts.join("\n");
}

function buildRecommendations(dashboard: DashboardJSON, columnStatistics: ColumnStatistics[]): string {
  const parts: string[] = [];

  const warnings = dashboard.insights.filter((i) => i.type === "warning");
  if (warnings.length > 0) parts.push(`Investigate: ${warnings[0].title}`);

  const outliers = columnStatistics.filter((cs) => cs.stats.outliers > 0);
  if (outliers.length > 0) parts.push(`Review outliers in: ${outliers.map((o) => o.columnName).join(", ")}`);

  const strongCorr = dashboard.insights.filter((i) => i.title.includes("correlation"));
  if (strongCorr.length > 0) parts.push(strongCorr[0].title);

  if (parts.length === 0) parts.push("Consider exploring category breakdowns and temporal trends.");

  return parts.join("\n");
}

function formatVal(n: number): string {
  if (Math.abs(n) >= 1_000_000) return formatCurrency(n);
  if (Math.abs(n) >= 1000) return formatCurrency(n);
  return formatNumber(n);
}
