import type {
  KPI,
  RecommendedChart,
  BusinessInsight,
  DashboardJSON,
  DashboardLayout,
  DashboardWidget,
  ColumnStatistics,
  TrendResult,
  CorrelationResult,
  DatasetMetadata,
  ColumnMetadata,
} from "@pulsebi/shared-types";
import { generateId, formatCurrency, formatNumber, formatPercent, round } from "@pulsebi/shared-utils";

export interface BIEngineInput {
  metadata: DatasetMetadata;
  columnStatistics: ColumnStatistics[];
  trends: TrendResult[];
  correlations: CorrelationResult[];
  rows: Record<string, unknown>[];
}

export function generateKPIs(input: BIEngineInput): KPI[] {
  const { metadata, columnStatistics, trends } = input;
  const kpis: KPI[] = [];

  const measures = metadata.columns.filter((c) => c.role === "measure");

  for (const measure of measures.slice(0, 6)) {
    const colStats = columnStatistics.find((cs) => cs.columnName === measure.name);
    if (!colStats) continue;

    const { stats } = colStats;
    const trend = trends.find((t) => t.valueColumn === measure.name);
    const format = detectFormat(measure.name);

    kpis.push({
      id: generateId(),
      title: formatTitle(measure.name),
      value: stats.sum,
      formattedValue: formatValue(stats.sum, format),
      previousValue: trend?.changePercent ? stats.sum / (1 + trend.changePercent / 100) : undefined,
      changePercent: trend?.changePercent,
      trend: trend?.direction,
      format,
      description: `Total ${formatTitle(measure.name)} across all records`,
    });
  }

  if (kpis.length === 0) {
    kpis.push({
      id: generateId(),
      title: "Total Records",
      value: input.metadata.rowCount,
      formattedValue: formatNumber(input.metadata.rowCount),
      trend: "flat",
      format: "number",
      description: "Total number of records in the dataset",
    });
  }

  for (const measure of measures.slice(0, 3)) {
    const colStats = columnStatistics.find((cs) => cs.columnName === measure.name);
    if (!colStats) continue;

    kpis.push({
      id: generateId(),
      title: `Avg ${formatTitle(measure.name)}`,
      value: colStats.stats.avg,
      formattedValue: formatValue(colStats.stats.avg, detectFormat(measure.name)),
      format: detectFormat(measure.name),
      description: `Mean ${measure.name} per record`,
    });
  }

  return kpis;
}

function getChartDimensions(metadata: DatasetMetadata): ColumnMetadata[] {
  return metadata.columns.filter((c) => {
    if (c.role !== "dimension") return false;
    if (c.detectedType === "date") return false;
    if (c.detectedType === "id") return false;
    if (c.uniqueCount <= 1) return false;
    if (c.uniqueCount > 20) return false;
    return true;
  });
}

export function generateRecommendedCharts(input: BIEngineInput): RecommendedChart[] {
  const { metadata, columnStatistics, trends, rows } = input;
  const charts: RecommendedChart[] = [];

  const measures = metadata.columns.filter((c) => c.role === "measure");
  const goodDimensions = getChartDimensions(metadata);

  for (const trend of trends.slice(0, 3)) {
    if (trend.dataPoints.length >= 2) {
      charts.push({
        id: generateId(),
        type: "line",
        title: `${formatTitle(trend.valueColumn)} Over Time`,
        description: `Trend of ${trend.valueColumn} — ${trend.direction === "up" ? "increasing" : trend.direction === "down" ? "decreasing" : "stable"}`,
        xAxis: trend.dateColumn,
        yAxis: trend.valueColumn,
        dataSource: "trends",
        priority: 1,
        config: { points: trend.dataPoints.map((dp) => ({ x: dp.period, y: dp.value })) },
      });
    }
  }

  if (goodDimensions.length > 0 && measures.length > 0) {
    const dim = goodDimensions[0];
    const measure = measures[0];
    const grouped = aggregateByDimension(rows, dim.name, measure.name);
    if (grouped.length > 0) {
      charts.push({
        id: generateId(),
        type: grouped.length <= 6 ? "pie" : "bar",
        title: `${formatTitle(measure.name)} by ${formatTitle(dim.name)}`,
        description: `Distribution of ${measure.name} across ${dim.name}`,
        xAxis: dim.name,
        yAxis: measure.name,
        groupBy: dim.name,
        dataSource: "aggregated",
        priority: 2,
        config: { data: grouped },
      });
    }
  }

  if (goodDimensions.length > 1 && measures.length > 0) {
    const dim = goodDimensions[1];
    const measure = measures.length > 1 ? measures[1] : measures[0];
    const grouped = aggregateByDimension(rows, dim.name, measure.name);
    if (grouped.length > 0) {
      charts.push({
        id: generateId(),
        type: "bar",
        title: `${formatTitle(measure.name)} by ${formatTitle(dim.name)}`,
        description: `Comparison of ${measure.name} across ${dim.name}`,
        xAxis: dim.name,
        yAxis: measure.name,
        groupBy: dim.name,
        dataSource: "aggregated",
        priority: 3,
        config: { data: grouped },
      });
    }
  }

  const numericMeasures = measures.filter((m) => m.detectedType === "integer" || m.detectedType === "decimal");
  if (numericMeasures.length >= 2) {
    const m1 = numericMeasures[0];
    const m2 = numericMeasures[1];
    const scatterData = rows
      .map((r) => ({ x: Number(r[m1.name]), y: Number(r[m2.name]) }))
      .filter((p) => !isNaN(p.x) && !isNaN(p.y))
      .slice(0, 500);

    if (scatterData.length > 10) {
      charts.push({
        id: generateId(),
        type: "scatter",
        title: `${formatTitle(m1.name)} vs ${formatTitle(m2.name)}`,
        description: `Relationship between ${m1.name} and ${m2.name}`,
        xAxis: m1.name,
        yAxis: m2.name,
        dataSource: "raw",
        priority: 4,
        config: { points: scatterData },
      });
    }
  }

  if (goodDimensions.length > 0 && measures.length > 1) {
    const dim = goodDimensions[0];
    const measure = measures[1];
    const grouped = aggregateByDimension(rows, dim.name, measure.name);
    if (grouped.length > 2) {
      charts.push({
        id: generateId(),
        type: "bar",
        title: `${formatTitle(measure.name)} by ${formatTitle(dim.name)}`,
        description: `Comparison of ${measure.name} across ${dim.name}`,
        xAxis: dim.name,
        yAxis: measure.name,
        groupBy: dim.name,
        dataSource: "aggregated",
        priority: 5,
        config: { data: grouped },
      });
    }
  }

  const numCols = measures.map((m) => m.name);
  const colStats = columnStatistics.find((cs) => numCols.includes(cs.columnName));
  if (colStats?.histogram && colStats.histogram.length > 2) {
    charts.push({
      id: generateId(),
      type: "histogram",
      title: `Distribution of ${formatTitle(colStats.columnName)}`,
      description: `Value distribution for ${colStats.columnName}`,
      xAxis: colStats.columnName,
      dataSource: "statistics",
      priority: 6,
      config: { bins: colStats.histogram },
    });
  }

  return charts;
}

export function generateInsights(input: BIEngineInput): BusinessInsight[] {
  const { metadata, columnStatistics, trends, correlations } = input;
  const insights: BusinessInsight[] = [];

  for (const trend of trends) {
    if (Math.abs(trend.changePercent) > 10) {
      insights.push({
        id: generateId(),
        type: trend.direction === "up" ? "positive" : "negative",
        title: `${formatTitle(trend.valueColumn)} ${trend.direction === "up" ? "increased" : "decreased"} by ${formatPercent(Math.abs(trend.changePercent))}`,
        description: `${formatTitle(trend.valueColumn)} shows a ${trend.direction} trend from ${formatValue(trend.dataPoints[0]?.value ?? 0, "number")} to ${formatValue(trend.dataPoints[trend.dataPoints.length - 1]?.value ?? 0, "number")}`,
        metric: trend.valueColumn,
        value: trend.changePercent,
        severity: Math.abs(trend.changePercent) > 25 ? "high" : "medium",
      });
    }
  }

  for (const cs of columnStatistics) {
    if (cs.stats.outliers > 0) {
      insights.push({
        id: generateId(),
        type: "warning",
        title: `${cs.stats.outliers} outlier${cs.stats.outliers > 1 ? "s" : ""} in ${formatTitle(cs.columnName)}`,
        description: `${cs.stats.outliers} data point${cs.stats.outliers > 1 ? "s" : ""} fall outside the expected range for ${cs.columnName}`,
        metric: cs.columnName,
        value: cs.stats.outliers,
        severity: cs.stats.outliers > 5 ? "high" : "low",
      });
    }
  }

  const strongCorrelations = correlations.filter((c) => c.strength === "strong");
  for (const corr of strongCorrelations.slice(0, 3)) {
    insights.push({
      id: generateId(),
      type: "info",
      title: `Strong ${corr.direction} correlation: ${formatTitle(corr.col1)} & ${formatTitle(corr.col2)}`,
      description: `Correlation coefficient: ${corr.r}. These metrics move ${corr.direction}ly together.`,
      severity: "medium",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: generateId(),
      type: "info",
      title: "Dataset Overview",
      description: `${metadata.rowCount} records with ${metadata.columnCount} columns analyzed. No significant anomalies detected.`,
      severity: "low",
    });
  }

  return insights;
}

export function generateDashboardJSON(input: BIEngineInput): DashboardJSON {
  const kpis = generateKPIs(input);
  const charts = generateRecommendedCharts(input);
  const insights = generateInsights(input);

  const widgets: DashboardWidget[] = [];

  kpis.forEach((kpi, i) => {
    widgets.push({
      id: generateId(),
      type: "kpi",
      title: kpi.title,
      kpi,
      position: { x: i % 4, y: Math.floor(i / 4), w: 1, h: 1 },
    });
  });

  charts.forEach((chart, i) => {
    const row = Math.floor(i / 2) + Math.ceil(kpis.length / 4);
    const col = i % 2;
    widgets.push({
      id: generateId(),
      type: "chart",
      title: chart.title,
      chart,
      position: { x: col * 2, y: row, w: 2, h: 2 },
    });
  });

  insights.slice(0, 4).forEach((insight, i) => {
    widgets.push({
      id: generateId(),
      type: "insight",
      title: insight.title,
      insight,
      position: { x: (i % 4), y: 99, w: 1, h: 1 },
    });
  });

  const layout: DashboardLayout = {
    widgets,
    columns: 4,
    rowHeight: 80,
  };

  return {
    id: generateId(),
    datasetId: input.metadata.id,
    title: `${input.metadata.filename} Dashboard`,
    subtitle: `Auto-generated from ${input.metadata.rowCount} records`,
    generatedAt: new Date().toISOString(),
    layout,
    kpis,
    charts,
    insights,
  };
}

function aggregateByDimension(
  rows: Record<string, unknown>[],
  dimCol: string,
  valCol: string
): { name: string; value: number }[] {
  const grouped = new Map<string, number[]>();
  for (const row of rows) {
    const key = String(row[dimCol] || "Unknown");
    const val = Number(row[valCol]);
    if (!isNaN(val)) {
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(val);
    }
  }
  return [...grouped.entries()]
    .map(([name, vals]) => ({ name, value: round(vals.reduce((a, b) => a + b, 0)) }))
    .sort((a, b) => b.value - a.value);
}

function detectFormat(name: string): "currency" | "number" | "percentage" {
  const lower = name.toLowerCase();
  if (lower.includes("revenue") || lower.includes("price") || lower.includes("cost") || lower.includes("amount") || lower.includes("sales") || lower.includes("profit")) {
    return "currency";
  }
  if (lower.includes("rate") || lower.includes("percent") || lower.includes("margin") || lower.includes("discount")) {
    return "percentage";
  }
  return "number";
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency": return formatCurrency(value);
    case "percentage": return formatPercent(value);
    default: return formatNumber(value);
  }
}

function formatTitle(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
