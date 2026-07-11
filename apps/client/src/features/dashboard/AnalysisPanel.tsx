import { useAppStore } from "../../stores/appStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ChartRenderer } from "./ChartRenderer";
import { InsightList } from "./InsightList";
import { Pin, X, Lightbulb, Target } from "lucide-react";

export function AnalysisPanel() {
  const { analysis, setAnalysis, pinAnalysisToDashboard } = useAppStore();

  if (!analysis) return null;

  return (
    <div className="mb-8 animate-in">
      <Card padding="none" className="overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50/50 to-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Lightbulb className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-900">AI Analysis</h3>
              <p className="text-xs text-surface-400">Temporary analysis — not part of your dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!analysis.pinned && analysis.chart && (
              <Button size="sm" onClick={pinAnalysisToDashboard}>
                <Pin className="h-3.5 w-3.5" />
                Pin to Dashboard
              </Button>
            )}
            {analysis.pinned && (
              <span className="text-xs font-medium text-success bg-success-light px-2.5 py-1 rounded-full">Pinned</span>
            )}
            <button onClick={() => setAnalysis(null)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="px-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-surface-200 text-sm text-surface-600">
            <Target className="h-3.5 w-3.5 text-brand-500" />
            {analysis.question}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Answer */}
          <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-line">{analysis.answer}</p>

          {/* Chart */}
          {analysis.chart && (
            <Card padding="none" className="overflow-hidden">
              <div className="px-5 pt-4 pb-1">
                <h4 className="text-sm font-semibold text-surface-900">{analysis.chart.title}</h4>
                <p className="text-xs text-surface-400">{analysis.chart.description}</p>
              </div>
              <div className="h-72">
                <ChartRenderer chart={analysis.chart} />
              </div>
            </Card>
          )}

          {/* Insights */}
          {analysis.insights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Insights</h4>
              <InsightList insights={analysis.insights} />
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Recommendations</h4>
              <div className="space-y-1.5">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-surface-600">
                    <span className="text-brand-500 mt-0.5">•</span>
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
