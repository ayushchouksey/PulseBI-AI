import type {
  ColumnStatistics,
  StatisticsResult,
  HistogramBin,
  NameValuePair,
  TrendResult,
  TrendDataPoint,
  CorrelationResult,
} from "@pulsebi/shared-types";
import { round, percentile, median as calcMedian, mode as calcMode } from "@pulsebi/shared-utils";

export function computeColumnStatistics(values: unknown[], columnName: string): ColumnStatistics {
  const numericValues = values.map(Number).filter((n) => !isNaN(n));
  const sorted = [...numericValues].sort((a, b) => a - b);

  const stats: StatisticsResult = computeStatistics(sorted);

  const histogram = computeHistogram(sorted, columnName);
  const topValues = computeTopValues(values, 5);
  const bottomValues = computeBottomValues(values, 5);

  return { columnName, stats, histogram, topValues, bottomValues };
}

export function computeStatistics(sorted: number[]): StatisticsResult {
  if (sorted.length === 0) {
    return emptyStats();
  }

  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  const med = calcMedian(sorted);
  const mod = calcMode(sorted);
  const min = sorted[0];
  const max = sorted[n - 1];

  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;

  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const outlierValues = sorted.filter((v) => v < lowFence || v > highFence);
  const outliers = outlierValues.length;

  const percentiles: Record<number, number> = {};
  for (const p of [10, 25, 50, 75, 90, 95, 99]) {
    percentiles[p] = round(percentile(sorted, p));
  }

  return {
    count: n,
    sum: round(sum),
    avg: round(avg),
    median: round(med),
    mode: mod !== null ? round(mod) : null,
    min: round(min),
    max: round(max),
    stdDev: round(stdDev),
    variance: round(variance),
    q1: round(q1),
    q3: round(q3),
    iqr: round(iqr),
    range: round(max - min),
    cv: avg !== 0 ? round((stdDev / Math.abs(avg)) * 100) : 0,
    outliers,
    outlierValues: outlierValues.slice(0, 20).map(round),
    percentiles,
  };
}

function computeHistogram(sorted: number[], _columnName: string): HistogramBin[] {
  if (sorted.length < 2) return [];

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const binCount = Math.min(20, Math.max(5, Math.ceil(Math.sqrt(sorted.length))));
  const binWidth = (max - min) / binCount || 1;

  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const binMin = min + i * binWidth;
    const binMax = min + (i + 1) * binWidth;
    return {
      label: `${round(binMin)} - ${round(binMax)}`,
      min: round(binMin),
      max: round(binMax),
      count: 0,
    };
  });

  for (const v of sorted) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count++;
  }

  return bins;
}

function computeTopValues(values: unknown[], limit: number): NameValuePair[] {
  const total = values.length;
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = String(v || "Unknown");
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value, percentage: round((value / total) * 100) }));
}

function computeBottomValues(values: unknown[], limit: number): NameValuePair[] {
  return computeTopValues(values, limit).reverse();
}

export function computeTrend(
  rows: Record<string, unknown>[],
  dateCol: string,
  valueCol: string
): TrendResult | null {
  const points = rows
    .map((r) => ({
      date: new Date(String(r[dateCol])),
      value: Number(r[valueCol]),
    }))
    .filter((p) => !isNaN(p.date.getTime()) && !isNaN(p.value))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (points.length < 2) return null;

  const grouped = new Map<string, number[]>();
  for (const p of points) {
    const key = p.date.toISOString().slice(0, 7);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p.value);
  }

  const dataPoints: TrendDataPoint[] = [...grouped.entries()]
    .map(([period, vals]) => ({
      period,
      value: round(vals.reduce((a, b) => a + b, 0) / vals.length),
      count: vals.length,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const slopes: number[] = [];
  for (let i = 1; i < dataPoints.length; i++) {
    slopes.push(dataPoints[i].value - dataPoints[i - 1].value);
  }
  const avgChange = slopes.length > 0 ? slopes.reduce((a, b) => a + b, 0) / slopes.length : 0;
  const direction: "up" | "down" | "flat" = avgChange > 0.01 ? "up" : avgChange < -0.01 ? "down" : "flat";

  const startValue = dataPoints[0]?.value ?? 0;
  const endValue = dataPoints[dataPoints.length - 1]?.value ?? 0;
  const changePercent = startValue !== 0 ? round(((endValue - startValue) / Math.abs(startValue)) * 100) : 0;

  return { dateColumn: dateCol, valueColumn: valueCol, direction, avgChange: round(avgChange), changePercent, dataPoints };
}

export function computeCorrelations(rows: Record<string, unknown>[], numericCols: string[]): CorrelationResult[] {
  const results: CorrelationResult[] = [];

  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i];
      const col2 = numericCols[j];

      const pairs = rows
        .map((r) => [Number(r[col1]), Number(r[col2])])
        .filter(([a, b]) => !isNaN(a) && !isNaN(b));

      if (pairs.length < 3) continue;

      const n = pairs.length;
      const sumX = pairs.reduce((s, [x]) => s + x, 0);
      const sumY = pairs.reduce((s, [, y]) => s + y, 0);
      const sumXY = pairs.reduce((s, [x, y]) => s + x * y, 0);
      const sumX2 = pairs.reduce((s, [x]) => s + x * x, 0);
      const sumY2 = pairs.reduce((s, [, y]) => s + y * y, 0);

      const num = n * sumXY - sumX * sumY;
      const den = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
      const r = den === 0 ? 0 : num / den;

      results.push({
        col1,
        col2,
        r: round(r),
        strength: Math.abs(r) > 0.7 ? "strong" : Math.abs(r) > 0.4 ? "moderate" : "weak",
        direction: r > 0 ? "positive" : "negative",
      });
    }
  }

  return results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
}

function emptyStats(): StatisticsResult {
  return {
    count: 0, sum: 0, avg: 0, median: 0, mode: null,
    min: 0, max: 0, stdDev: 0, variance: 0,
    q1: 0, q3: 0, iqr: 0, range: 0, cv: 0,
    outliers: 0, outlierValues: [], percentiles: {},
  };
}
