import type {
    Trend,
  } from "@pulsebi/shared-types";
  
  import type {
    Calculator,
  } from "../../core/calculator.interface.js";
  
  import type {
    StatisticsContext,
  } from "./types.js";
  
  export class TrendCalculator
    implements Calculator<StatisticsContext>
  {
  
    public execute(
      context: StatisticsContext
    ): StatisticsContext {
  
      const dateColumn =
        context.metadata.find(
          column => column.businessRole === "date"
        );
  
      const metricColumn =
        context.metadata.find(
          column => column.businessRole === "metric"
        );
  
      if (!dateColumn || !metricColumn) {
  
        context.trends = [];
  
        return context;
  
      }
  
      const grouped = new Map<string, number>();
  
      for (const row of context.dataset.rows) {
  
        const date =
          row[dateColumn.originalName];
  
        const value =
          row[metricColumn.originalName];
  
        if (
          !(date instanceof Date) ||
          typeof value !== "number"
        ) {
          continue;
        }
  
        const key =
          date.toISOString().split("T")[0];
  
        grouped.set(
          key,
          (grouped.get(key) ?? 0) + value
        );
  
      }
  
      const trend: Trend = {
  
        name:
          `${metricColumn.displayName} Trend`,
  
        x:
          [...grouped.keys()],
  
        y:
          [...grouped.values()],
  
      };
  
      context.trends = [trend];
  
      return context;
  
    }
  
  }