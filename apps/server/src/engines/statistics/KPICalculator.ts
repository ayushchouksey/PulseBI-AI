import type {
    KPI,
  } from "@pulsebi/shared-types";
  
  import type {
    Calculator,
  } from "../../core/calculator.interface.js";
  
  import type {
    StatisticsContext,
  } from "./types.js";
  
  export class KPICalculator
    implements Calculator<StatisticsContext>
  {
    execute(
      context: StatisticsContext
    ): StatisticsContext {
  
      const kpis: KPI[] = [];
  
      const metricColumns =
        context.metadata.filter(
          column => column.businessRole === "metric"
        );
  
      for (const column of metricColumns) {
  
        const values = context.dataset.rows
          .map(row => Number(row[column.originalName]))
          .filter(value => !Number.isNaN(value));
  
        const total = values.reduce(
          (sum, value) => sum + value,
          0
        );
  
        kpis.push({
            name: column.displayName,
            value: total,
            aggregation: column.aggregation,
            format: "number",
          });
  
      }
  
      context.kpis = kpis;
  
      return context;
    }
  }