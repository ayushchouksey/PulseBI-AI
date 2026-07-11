import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card } from "../../components/ui/Card";
import { ChartRenderer } from "./ChartRenderer";
import { InsightList } from "./InsightList";
import { SummaryBar } from "./SummaryBar";
import { AnalysisPanel } from "./AnalysisPanel";
import { ChatPanel } from "../chat/ChatPanel";
import { Button } from "../../components/ui/Button";
import { MessageSquare, Download, Loader2, Upload, Sparkles } from "lucide-react";
import { exportChartToPDF, exportDashboardToPDF } from "../../utils/exportPdf";

export function DashboardPage() {
  const { dashboard, chatOpen, toggleChat, newlyAddedChartId, clearNewlyAddedChartId, highlightedChartId, reset } = useAppStore();
  const chartRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [exportingAll, setExportingAll] = useState(false);

  // Auto-scroll to newly added chart
  useEffect(() => {
    if (newlyAddedChartId) {
      const timer = setTimeout(() => {
        const el = chartRefs.current.get(newlyAddedChartId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-brand-400", "ring-offset-2");
          setTimeout(() => el.classList.remove("ring-2", "ring-brand-400", "ring-offset-2"), 2500);
        }
        clearNewlyAddedChartId();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newlyAddedChartId, clearNewlyAddedChartId]);

  // Auto-scroll to highlighted chart
  useEffect(() => {
    if (highlightedChartId) {
      const timer = setTimeout(() => {
        const el = chartRefs.current.get(highlightedChartId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightedChartId]);

  if (!dashboard) return null;

  const kpis = dashboard.kpis || [];
  const charts = dashboard.charts || [];
  const insights = dashboard.insights || [];

  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      await exportDashboardToPDF(dashboard.title);
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-30 glass border-b border-surface-200">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-surface-900">{dashboard.title}</h1>
            <p className="text-xs text-surface-400">{dashboard.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleExportAll} disabled={exportingAll}>
              {exportingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {exportingAll ? "Exporting..." : "Export PDF"}
            </Button>
            <Button variant="ghost" size="sm" onClick={reset}>
              <Upload className="h-4 w-4" />
              New Upload
            </Button>
            <Button variant={chatOpen ? "primary" : "secondary"} size="sm" onClick={toggleChat}>
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content — captured for PDF */}
      <div id="dashboard-content" className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Layer 1: Executive Summary */}
        <SummaryBar />

        {/* Layer 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.slice(0, 8).map((kpi, i) => (
            <MetricCard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>

        {/* Layer 1: Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {charts.map((chart) => {
            const isHighlighted = highlightedChartId === chart.id;
            const hasHighlight = highlightedChartId !== null;
            const isFaded = hasHighlight && !isHighlighted;
            const isAiAdded = chart.dataSource === "dashboard_modification";

            return (
              <div
                key={chart.id}
                ref={(el) => { if (el) chartRefs.current.set(chart.id, el); }}
                className={`transition-all duration-500 ${
                  isHighlighted
                    ? "ring-3 ring-brand-400 ring-offset-2 scale-[1.02] shadow-lg"
                    : isFaded
                    ? "opacity-40 scale-[0.98]"
                    : ""
                }`}
              >
                <Card padding="none" className="overflow-hidden animate-in">
                  <div className="px-6 pt-5 pb-2 flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-surface-900">{chart.title}</h3>
                          {isAiAdded && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-semibold border border-brand-200">
                              <Sparkles className="h-2.5 w-2.5" />
                              Added via AI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-surface-400 mt-0.5">{chart.description}</p>
                      </div>
                    </div>
                    <ChartExportButton chartRef={chartRefs.current.get(chart.id) ?? null} title={chart.title} />
                  </div>
                  <div className="h-72">
                    <ChartRenderer chart={chart} />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Layer 1: Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-surface-900 mb-4">Insights & Alerts</h2>
            <InsightList insights={insights} />
          </div>
        )}

        {/* Layer 2: AI Analysis Panel (transient — all modes) */}
        <AnalysisPanel />
      </div>

      {/* Layer 3: Chat Panel */}
      {chatOpen && <ChatPanel />}
    </div>
  );
}

function ChartExportButton({ chartRef, title }: { chartRef: HTMLDivElement | null; title: string }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!chartRef) return;
    setExporting(true);
    try {
      await exportChartToPDF(chartRef, title);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
      title="Export chart as PDF"
    >
      {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
    </button>
  );
}
