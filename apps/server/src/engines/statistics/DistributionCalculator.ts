import type {
    Distribution,
  } from "@pulsebi/shared-types";
  
  import type {
    Calculator,
  } from "../../core/calculator.interface.js";
  
  import type {
    StatisticsContext,
  } from "./types.js";
  
  export class DistributionCalculator
    implements Calculator<StatisticsContext>
  {
  
    public execute(
      context: StatisticsContext
    ): StatisticsContext {
  
      const category =
        context.metadata.find(
          column => column.businessRole === "category"
        );
  
      if (!category) {
  
        context.distributions = [];
  
        return context;
  
      }
  
      const grouped =
        new Map<string, number>();
  
      context.dataset.rows.forEach(row => {
  
        const value =
          String(
            row[category.originalName] ?? "Unknown"
          );
  
        grouped.set(
          value,
          (grouped.get(value) ?? 0) + 1
        );
  
      });
  
      const distribution: Distribution = {
  
        name:
          category.displayName,
  
        labels:
          [...grouped.keys()],
  
        values:
          [...grouped.values()],
  
      };
  
      context.distributions = [distribution];
  
      return context;
  
    }
  
  }