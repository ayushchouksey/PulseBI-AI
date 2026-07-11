import type { RecommendationResult, ExecutiveBrief, DecisionSupport, ExplainResult } from "@pulsebi/shared-types";
import { useAppStore } from "../../stores/appStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ChartRenderer } from "./ChartRenderer";
import { InsightList } from "./InsightList";
import {
  Pin, X, Lightbulb, Target, TrendingUp, AlertTriangle,
  CheckCircle, BarChart3, Brain, Shield, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const MODE_CONFIG = {
  analysis: { icon: BarChart3, label: "AI Analysis", color: "text-brand-500", bg: "bg-brand-500" },
  recommendation: { icon: TrendingUp, label: "Recommendation", color: "text-amber-500", bg: "bg-amber-500" },
  executive_brief: { icon: Brain, label: "Executive Brief", color: "text-purple-500", bg: "bg-purple-500" },
  decision_support: { icon: Shield, label: "Decision Support", color: "text-emerald-500", bg: "bg-emerald-500" },
  explain: { icon: Lightbulb, label: "Explanation", color: "text-sky-500", bg: "bg-sky-500" },
  highlight: { icon: Target, label: "Highlight", color: "text-rose-500", bg: "bg-rose-500" },
} as const;

export function AnalysisPanel() {
  const { analysis, setAnalysis, pinAnalysisToDashboard } = useAppStore();

  if (!analysis) return null;

  const mode = (analysis.recommendation ? "recommendation"
    : analysis.executiveBrief ? "executive_brief"
    : analysis.decisionSupport ? "decision_support"
    : analysis.explain ? "explain"
    : "analysis") as keyof typeof MODE_CONFIG;

  const config = MODE_CONFIG[mode];
  const Icon = config.icon;

  return (
    <div className="mb-8 animate-in">
      <Card padding="none" className="overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50/50 to-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center`}>
              <Icon className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-900">{config.label}</h3>
              <p className="text-xs text-surface-400">Temporary — not part of your dashboard</p>
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
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Pinned</span>
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

        {/* Content — renders based on mode */}
        <div className="p-6 space-y-5">
          {mode === "recommendation" && analysis.recommendation && (
            <RecommendationCard data={analysis.recommendation} />
          )}
          {mode === "executive_brief" && analysis.executiveBrief && (
            <ExecutiveBriefCard data={analysis.executiveBrief} />
          )}
          {mode === "decision_support" && analysis.decisionSupport && (
            <DecisionSupportCard data={analysis.decisionSupport} />
          )}
          {mode === "explain" && analysis.explain && (
            <ExplainCard data={analysis.explain} />
          )}

          {/* Answer text */}
          {!analysis.recommendation && !analysis.executiveBrief && !analysis.decisionSupport && (
            <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-line">{analysis.answer}</p>
          )}

          {/* Chart (for analysis mode) */}
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

// ─── Mode-Specific Card Components ───────────────────────────────

function RecommendationCard({ data }: { data: RecommendationResult }) {
  const impactColors = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-bold text-surface-900">{data.title}</span>
      </div>
      {data.priorities.map((p, i) => (
        <div key={i} className={`p-3 rounded-lg border ${impactColors[p.impact]}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{p.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 font-medium">{p.impact} impact</span>
          </div>
          <p className="text-xs mt-1 opacity-80">{p.description}</p>
          {p.currentValue && (
            <p className="text-xs mt-1 font-mono">Current: {p.currentValue}</p>
          )}
        </div>
      ))}
      <p className="text-xs text-surface-500 italic">Expected impact: {data.expectedImpact}</p>
    </div>
  );
}

function ExecutiveBriefCard({ data }: { data: ExecutiveBrief }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-surface-900">{data.title}</h4>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {data.metrics.map((m, i) => (
          <div key={i} className="p-3 rounded-lg bg-white border border-surface-200">
            <p className="text-xs text-surface-500">{m.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-surface-900">{m.value}</span>
              {m.change !== undefined && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${m.direction === "up" ? "text-emerald-600" : "text-red-500"}`}>
                  {m.direction === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(m.change).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Risks */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-surface-700">Risks</span>
        </div>
        {data.risks.map((r, i) => (
          <p key={i} className="text-sm text-surface-600 ml-5">• {r}</p>
        ))}
      </div>

      {/* Opportunities */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs font-semibold text-surface-700">Opportunities</span>
        </div>
        {data.opportunities.map((o, i) => (
          <p key={i} className="text-sm text-surface-600 ml-5">• {o}</p>
        ))}
      </div>

      {/* Recommendation */}
      <div className="p-3 rounded-lg bg-brand-50 border border-brand-200">
        <p className="text-sm font-semibold text-brand-800">Recommendation: {data.recommendation}</p>
      </div>
    </div>
  );
}

function DecisionSupportCard({ data }: { data: DecisionSupport }) {
  const verdictConfig = {
    yes: { label: "Favorable", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    no: { label: "Not Advisable", color: "text-red-700 bg-red-50 border-red-200" },
    conditional: { label: "Requires Analysis", color: "text-amber-700 bg-amber-50 border-amber-200" },
  };

  const vc = verdictConfig[data.verdict];

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border ${vc.color}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{vc.label}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 font-medium">Confidence: {data.confidence}</span>
        </div>
        <p className="text-xs mt-1 opacity-80">{data.reasoning}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {data.factors.map((f, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-white border border-surface-200">
            <p className="text-xs text-surface-500">{f.label}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-semibold text-surface-900">{f.value}</span>
              {f.direction && (
                f.direction === "up"
                  ? <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  : <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExplainCard({ data }: { data: ExplainResult }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-surface-900">{data.title}</h4>
      <p className="text-sm text-surface-700 leading-relaxed">{data.explanation}</p>

      <div>
        <h5 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Possible Causes</h5>
        {data.causes.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-surface-600 mb-1.5">
            <span className="text-sky-500 mt-0.5">•</span>
            {c}
          </div>
        ))}
      </div>

      {data.recommendation && (
        <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
          <p className="text-sm text-sky-800">{data.recommendation}</p>
        </div>
      )}
    </div>
  );
}
