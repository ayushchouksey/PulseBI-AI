import type {
    ColumnMetadata,
  } from "@pulsebi/shared-types";
  
  import type {
    DashboardWidget,
  } from "./types.js";
  
  export class ChartRecommendationEngine {
  
    execute(
      metadata: ColumnMetadata[]
    ): DashboardWidget[] {
  
      const widgets: DashboardWidget[] = [];
  
      const metrics =
        metadata.filter(
          column =>
            column.businessRole === "metric"
        );
  
      const categories =
        metadata.filter(
          column =>
            column.businessRole === "category"
        );
  
      const dates =
        metadata.filter(
          column =>
            column.businessRole === "date"
        );
  
      if (
        metrics.length &&
        categories.length
      ) {
  
        widgets.push({
  
          id: "bar-chart",
  
          title:
            `${metrics[0].displayName} by ${categories[0].displayName}`,
  
          type: "bar",
  
          config: {
  
            xAxis:
              categories[0].originalName,
  
            yAxis:
              metrics[0].originalName,
  
            aggregation:
              metrics[0].aggregation,
  
          },
  
        });
  
      }
  
      if (
        metrics.length &&
        dates.length
      ) {
  
        widgets.push({
  
          id: "line-chart",
  
          title:
            `${metrics[0].displayName} Trend`,
  
          type: "line",
  
          config: {
  
            xAxis:
              dates[0].originalName,
  
            yAxis:
              metrics[0].originalName,
  
            aggregation:
              metrics[0].aggregation,
  
          },
  
        });
  
      }
  
      return widgets;
  
    }
  
  }