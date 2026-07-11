import { memo } from "react";
import { Card } from "../ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { classNames } from "@pulsebi/shared-utils";
import type { KPI } from "@pulsebi/shared-types";

interface MetricCardProps {
  kpi: KPI;
  index?: number;
}

export const MetricCard = memo(function MetricCard({ kpi, index = 0 }: MetricCardProps) {
  const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    flat: Minus,
  }[kpi.trend || "flat"];

  const TrendIcon = trendIcon;
  const trendColor = {
    up: "text-success",
    down: "text-danger",
    flat: "text-surface-400",
  }[kpi.trend || "flat"];

  const trendBg = {
    up: "bg-success-light",
    down: "bg-danger-light",
    flat: "bg-surface-100",
  }[kpi.trend || "flat"];

  return (
    <Card
      hover
      className={classNames("animate-in", `delay-${Math.min(index * 100, 400)}`)}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-surface-500">{kpi.title}</p>
          {kpi.changePercent !== undefined && (
            <div className={classNames("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", trendBg, trendColor)}>
              <TrendIcon className="h-3 w-3" />
              <span>{kpi.changePercent > 0 ? "+" : ""}{kpi.changePercent.toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-surface-900 tracking-tight">
            {kpi.formattedValue}
          </p>
        </div>
        <p className="text-xs text-surface-400">{kpi.description}</p>
      </div>
    </Card>
  );
});
