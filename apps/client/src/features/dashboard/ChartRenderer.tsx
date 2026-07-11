import Plot from "react-plotly.js";
import type { RecommendedChart } from "@pulsebi/shared-types";

interface ChartRendererProps {
  chart: RecommendedChart;
  compact?: boolean;
}

export function ChartRenderer({ chart, compact }: ChartRendererProps) {
  const config = chart.config;

  switch (chart.type) {
    case "line":
      return renderLineChart(chart, config, compact);
    case "bar":
      return renderBarChart(chart, config, compact);
    case "pie":
      return renderPieChart(chart, config, compact);
    case "scatter":
      return renderScatterChart(chart, config, compact);
    case "histogram":
      return renderHistogram(chart, config, compact);
    case "area":
      return renderAreaChart(chart, config, compact);
    default:
      return renderBarChart(chart, config, compact);
  }
}

// ─── Data normalization helpers ───────────────────────────────────

interface NormalizedBar {
  name: string;
  value: number;
}

function normalizeBarData(config: Record<string, unknown>): NormalizedBar[] | undefined {
  // Format 1: { data: [{ name, value }] }
  const raw1 = config.data as { name: string; value: number }[] | undefined;
  if (raw1 && raw1.length > 0 && "name" in raw1[0] && "value" in raw1[0]) {
    return raw1.filter((d) => d.name != null && isFinite(d.value));
  }
  // Format 2: { data: [{ [dimCol]: string, total, count }] }
  const raw2 = config.data as Record<string, unknown>[] | undefined;
  if (raw2 && raw2.length > 0) {
    const keys = Object.keys(raw2[0]);
    const nameKey = keys.find((k) => typeof raw2[0][k] === "string") || keys[0];
    const valueKey = keys.find((k) => k === "total" || k === "value" || k === "count") || keys.find((k) => typeof raw2[0][k] === "number");
    if (nameKey && valueKey) {
      return raw2
        .map((d) => ({ name: String(d[nameKey] ?? "Unknown"), value: Number(d[valueKey]) || 0 }))
        .filter((d) => isFinite(d.value));
    }
  }
  return undefined;
}

interface NormalizedPoint {
  x: string | number;
  y: number;
}

function normalizePoints(config: Record<string, unknown>): NormalizedPoint[] | undefined {
  const raw = config.points as { x: string | number; y: number }[] | undefined;
  if (!raw) return undefined;
  return raw
    .map((p) => ({ x: p.x, y: Number(p.y) || 0 }))
    .filter((p) => isFinite(p.y));
}

// ─── Chart Renderers ─────────────────────────────────────────────

function renderLineChart(chart: RecommendedChart, config: Record<string, unknown>, compact?: boolean) {
  const points = normalizePoints(config);
  if (!points || points.length === 0) return <EmptyChart compact />;

  return (
    <Plot
      data={[
        {
          x: points.map((p) => p.x),
          y: points.map((p) => p.y),
          type: "scatter",
          mode: "lines+markers",
          line: { color: "#3366ff", width: 3, shape: "spline" },
          marker: { size: compact ? 4 : 6, color: "#3366ff" },
          fill: "tozeroy",
          fillcolor: "rgba(51, 102, 255, 0.08)",
          hovertemplate: `<b>%{x}</b><br>${chart.yAxis || "Value"}: %{y:,.0f}<extra></extra>`,
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "", standoff: 12 } },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "", standoff: 8 } },
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderBarChart(chart: RecommendedChart, config: Record<string, unknown>, compact?: boolean) {
  const data = normalizeBarData(config);
  if (!data || data.length === 0) return <EmptyChart compact />;

  const colors = generateColors(data.length);

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.name),
          y: data.map((d) => d.value),
          type: "bar",
          marker: {
            color: colors,
            line: { color: colors.map((c) => c), width: 0 },
          },
          textposition: "outside",
          textfont: { size: compact ? 9 : 11, color: "#475569" },
          texttemplate: "%{y:,.0f}",
          hovertemplate: `<b>%{x}</b><br>${chart.yAxis || "Value"}: %{y:,.0f}<extra></extra>`,
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "", standoff: 12 }, tickangle: data.length > 6 ? -45 : 0 },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "", standoff: 8 } },
        bargap: 0.3,
        showlegend: false,
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderPieChart(chart: RecommendedChart, config: Record<string, unknown>, compact?: boolean) {
  const data = normalizeBarData(config);
  if (!data || data.length === 0) return <EmptyChart compact />;

  const colors = generateColors(data.length);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Plot
      data={[
        {
          labels: data.map((d) => d.name),
          values: data.map((d) => d.value),
          type: "pie",
          hole: 0.55,
          marker: { colors, line: { color: "#fff", width: 2 } },
          textinfo: "label+percent",
          textposition: "outside",
          textfont: { size: compact ? 10 : 12, color: "#475569" },
          hovertemplate: `<b>%{label}</b><br>Value: %{value:,.0f}<br>Share: %{percent}<extra></extra>`,
          pull: data.map(() => 0.02),
        },
      ]}
      layout={{
        ...defaultLayout,
        showlegend: false,
        annotations: compact ? [] : [{
          text: `<b>${formatCompact(total)}</b><br>Total`,
          showarrow: false,
          font: { size: 16, color: "#1e293b", family: "Inter, system-ui" },
          x: 0.5,
          y: 0.5,
        }],
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderScatterChart(chart: RecommendedChart, config: Record<string, unknown>, compact?: boolean) {
  const points = config.points as { x: number; y: number }[] | undefined;
  if (!points) return <EmptyChart compact />;

  const filtered = points.filter((p) => isFinite(p.x) && isFinite(p.y));

  return (
    <Plot
      data={[
        {
          x: filtered.map((p) => p.x),
          y: filtered.map((p) => p.y),
          type: "scatter",
          mode: "markers",
          marker: {
            size: compact ? 6 : 10,
            color: "#3366ff",
            opacity: 0.65,
            line: { width: 1.5, color: "#1a44f5" },
          },
          hovertemplate: `<b>${chart.xAxis || "X"}</b>: %{x}<br><b>${chart.yAxis || "Y"}</b>: %{y:,.0f}<extra></extra>`,
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "", standoff: 12 } },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "", standoff: 8 } },
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderHistogram(chart: RecommendedChart, config: Record<string, unknown>, compact?: boolean) {
  const bins = config.bins as { label: string; count: number }[] | undefined;
  if (!bins) return <EmptyChart compact />;

  return (
    <Plot
      data={[
        {
          x: bins.map((b) => b.label),
          y: bins.map((b) => b.count),
          type: "bar",
          marker: {
            color: "rgba(51, 102, 255, 0.7)",
            line: { color: "rgba(51, 102, 255, 1)", width: 1 },
          },
          hovertemplate: `<b>%{x}</b><br>Count: %{y}<extra></extra>`,
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "", standoff: 12 }, tickangle: -45 },
        yaxis: { ...defaultLayout.yaxis, title: { text: "Count", standoff: 8 } },
        bargap: 0.05,
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderAreaChart(chart: RecommendedChart, config: Record<string, unknown>, compact?: boolean) {
  const points = normalizePoints(config);
  if (!points || points.length === 0) return <EmptyChart compact />;

  return (
    <Plot
      data={[
        {
          x: points.map((p) => p.x),
          y: points.map((p) => p.y),
          type: "scatter",
          fill: "tozeroy",
          fillcolor: "rgba(51, 102, 255, 0.15)",
          line: { color: "#3366ff", width: 2, shape: "spline" },
          hovertemplate: `<b>%{x}</b><br>${chart.yAxis || "Value"}: %{y:,.0f}<extra></extra>`,
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "", standoff: 12 } },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "", standoff: 8 } },
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function EmptyChart({ compact }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "h-40" : "h-64"} flex items-center justify-center text-surface-400 text-sm`}>
      No chart data available
    </div>
  );
}

const defaultLayout = {
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { family: "Inter, system-ui, sans-serif", size: 12, color: "#64748b" },
  margin: { l: 52, r: 24, t: 16, b: 52 },
  xaxis: {
    gridcolor: "#f1f5f9",
    linecolor: "#e2e8f0",
    showgrid: true,
    zeroline: false,
    tickfont: { size: 11, color: "#94a3b8" },
  },
  yaxis: {
    gridcolor: "#f1f5f9",
    linecolor: "#e2e8f0",
    showgrid: true,
    zeroline: false,
    tickfont: { size: 11, color: "#94a3b8" },
    tickformat: ",.0f",
  },
  hoverlabel: {
    bgcolor: "#0f172a",
    bordercolor: "transparent",
    font: { color: "#f8fafc", size: 13, family: "Inter, system-ui, sans-serif" },
    align: "left" as const,
    namelength: -1,
    padding: 12,
  },
  hovermode: "closest" as const,
};

const defaultConfig = {
  displayModeBar: false,
  responsive: true,
};

const CHART_COLORS = [
  "#3366ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
];

function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => CHART_COLORS[i % CHART_COLORS.length]);
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
