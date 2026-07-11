import Plot from "react-plotly.js";
import type { RecommendedChart } from "@pulsebi/shared-types";

interface ChartRendererProps {
  chart: RecommendedChart;
}

export function ChartRenderer({ chart }: ChartRendererProps) {
  const config = chart.config;

  switch (chart.type) {
    case "line":
      return renderLineChart(chart, config);
    case "bar":
      return renderBarChart(chart, config);
    case "pie":
      return renderPieChart(chart, config);
    case "scatter":
      return renderScatterChart(chart, config);
    case "histogram":
      return renderHistogram(chart, config);
    case "area":
      return renderAreaChart(chart, config);
    default:
      return renderBarChart(chart, config);
  }
}

function renderLineChart(chart: RecommendedChart, config: Record<string, unknown>) {
  const points = config.points as { x: string; y: number }[] | undefined;
  if (!points) return <EmptyChart />;

  return (
    <Plot
      data={[
        {
          x: points.map((p) => p.x),
          y: points.map((p) => p.y),
          type: "scatter",
          mode: "lines+markers",
          line: { color: "#3366ff", width: 3, shape: "spline" },
          marker: { size: 6, color: "#3366ff" },
          fill: "tozeroy",
          fillcolor: "rgba(51, 102, 255, 0.08)",
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "" } },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "" } },
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderBarChart(chart: RecommendedChart, config: Record<string, unknown>) {
  const data = config.data as { name: string; value: number }[] | undefined;
  if (!data) return <EmptyChart />;

  const colors = generateColors(data.length);

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.name),
          y: data.map((d) => d.value),
          type: "bar",
          marker: { color: colors },
          hovertemplate: "%{x}<br>%{y:,.0f}<extra></extra>",
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "" }, tickangle: data.length > 6 ? -45 : 0 },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "" } },
        bargap: 0.3,
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderPieChart(chart: RecommendedChart, config: Record<string, unknown>) {
  const data = config.data as { name: string; value: number }[] | undefined;
  if (!data) return <EmptyChart />;

  const colors = generateColors(data.length);

  return (
    <Plot
      data={[
        {
          labels: data.map((d) => d.name),
          values: data.map((d) => d.value),
          type: "pie",
          hole: 0.55,
          marker: { colors },
          textinfo: "label+percent",
          textposition: "outside",
          textfont: { size: 12 },
          hovertemplate: "%{label}<br>%{value:,.0f}<br>%{percent}<extra></extra>",
        },
      ]}
      layout={{
        ...defaultLayout,
        showlegend: false,
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderScatterChart(chart: RecommendedChart, config: Record<string, unknown>) {
  const points = config.points as { x: number; y: number }[] | undefined;
  if (!points) return <EmptyChart />;

  return (
    <Plot
      data={[
        {
          x: points.map((p) => p.x),
          y: points.map((p) => p.y),
          type: "scatter",
          mode: "markers",
          marker: {
            size: 8,
            color: "#3366ff",
            opacity: 0.6,
            line: { width: 1, color: "#1a44f5" },
          },
          hovertemplate: "X: %{x}<br>Y: %{y}<extra></extra>",
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "" } },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "" } },
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderHistogram(chart: RecommendedChart, config: Record<string, unknown>) {
  const bins = config.bins as { label: string; count: number }[] | undefined;
  if (!bins) return <EmptyChart />;

  return (
    <Plot
      data={[
        {
          x: bins.map((b) => b.label),
          y: bins.map((b) => b.count),
          type: "bar",
          marker: { color: "rgba(51, 102, 255, 0.7)" },
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "" }, tickangle: -45 },
        yaxis: { ...defaultLayout.yaxis, title: { text: "Count" } },
        bargap: 0.05,
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function renderAreaChart(chart: RecommendedChart, config: Record<string, unknown>) {
  const points = config.points as { x: string; y: number }[] | undefined;
  if (!points) return <EmptyChart />;

  return (
    <Plot
      data={[
        {
          x: points.map((p) => p.x),
          y: points.map((p) => p.y),
          type: "scatter",
          fill: "tozeroy",
          fillcolor: "rgba(51, 102, 255, 0.15)",
          line: { color: "#3366ff", width: 2 },
        },
      ]}
      layout={{
        ...defaultLayout,
        xaxis: { ...defaultLayout.xaxis, title: { text: chart.xAxis || "" } },
        yaxis: { ...defaultLayout.yaxis, title: { text: chart.yAxis || "" } },
      }}
      config={defaultConfig}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function EmptyChart() {
  return (
    <div className="h-64 flex items-center justify-center text-surface-400 text-sm">
      No chart data available
    </div>
  );
}

const defaultLayout = {
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { family: "Inter, system-ui, sans-serif", size: 12, color: "#64748b" },
  margin: { l: 48, r: 24, t: 16, b: 48 },
  xaxis: {
    gridcolor: "#f1f5f9",
    linecolor: "#e2e8f0",
    showgrid: true,
    zeroline: false,
  },
  yaxis: {
    gridcolor: "#f1f5f9",
    linecolor: "#e2e8f0",
    showgrid: true,
    zeroline: false,
  },
  hoverlabel: {
    bgcolor: "#1e293b",
    font: { color: "#fff", size: 13 },
    bordercolor: "transparent",
  },
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
