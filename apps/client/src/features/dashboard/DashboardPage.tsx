import { useAppStore } from "../../stores/appStore";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card } from "../../components/ui/Card";
import { ChartRenderer } from "./ChartRenderer";
import { InsightList } from "./InsightList";
import { SummaryBar } from "./SummaryBar";
import { ChatPanel } from "../chat/ChatPanel";
import { Button } from "../../components/ui/Button";
import { MessageSquare, Download, RefreshCw } from "lucide-react";

export function DashboardPage() {
  const { dashboard, chatOpen, toggleChat } = useAppStore();

  if (!dashboard) return null;

  const kpis = dashboard.kpis || [];
  const charts = dashboard.charts || [];
  const insights = dashboard.insights || [];

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
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant={chatOpen ? "primary" : "secondary"}
              size="sm"
              onClick={toggleChat}
            >
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Executive Summary */}
        <SummaryBar />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.slice(0, 8).map((kpi, i) => (
            <MetricCard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {charts.slice(0, 6).map((chart) => (
            <Card key={chart.id} padding="none" className="overflow-hidden animate-in">
              <div className="px-6 pt-5 pb-2">
                <h3 className="text-sm font-semibold text-surface-900">{chart.title}</h3>
                <p className="text-xs text-surface-400 mt-0.5">{chart.description}</p>
              </div>
              <div className="h-72">
                <ChartRenderer chart={chart} />
              </div>
            </Card>
          ))}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-surface-900 mb-4">Insights & Alerts</h2>
            <InsightList insights={insights} />
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {chatOpen && <ChatPanel />}
    </div>
  );
}
