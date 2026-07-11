import { memo } from "react";
import type { BusinessInsight } from "@pulsebi/shared-types";
import { Card } from "../../components/ui/Card";
import { AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react";
import { classNames } from "@pulsebi/shared-utils";

interface InsightListProps {
  insights: BusinessInsight[];
}

const typeConfig = {
  positive: { icon: TrendingUp, color: "text-success", bg: "bg-success-light", border: "border-success/20" },
  negative: { icon: TrendingDown, color: "text-danger", bg: "bg-danger-light", border: "border-danger/20" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning-light", border: "border-warning/20" },
  info: { icon: Info, color: "text-info", bg: "bg-info-light", border: "border-info/20" },
};

export const InsightList = memo(function InsightList({ insights }: InsightListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {insights.map((insight, i) => {
        const config = typeConfig[insight.type];
        const Icon = config.icon;

        return (
          <Card
            key={insight.id}
            className={classNames("animate-in border-l-4", config.border)}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                <Icon className={classNames("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-900 leading-tight">{insight.title}</h4>
                <p className="text-xs text-surface-500 mt-1 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
});
