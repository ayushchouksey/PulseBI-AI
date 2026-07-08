import type {
    Calculator,
  } from "../../core/calculator.interface.js";
  
  import type {
    StatisticsContext,
  } from "./types.js";
  
  export class DatasetProfiler
    implements Calculator<StatisticsContext>
  {
    execute(
      context: StatisticsContext
    ): StatisticsContext {
  
      const metadata =
        context.metadata;
  
      context.profile = {
  
        rowCount:
          context.dataset.totalRows,
  
        columnCount:
          context.dataset.totalColumns,
  
        numericColumns:
          metadata
            .filter(
              column =>
                column.detectedType === "number"
            )
            .map(
              column =>
                column.originalName
            ),
  
        categoryColumns:
          metadata
            .filter(
              column =>
                column.businessRole === "category"
            )
            .map(
              column =>
                column.originalName
            ),
  
        dateColumns:
          metadata
            .filter(
              column =>
                column.businessRole === "date"
            )
            .map(
              column =>
                column.originalName
            ),
  
        metricColumns:
          metadata
            .filter(
              column =>
                column.businessRole === "metric"
            )
            .map(
              column =>
                column.originalName
            ),
  
      };
  
      return context;
  
    }
  }