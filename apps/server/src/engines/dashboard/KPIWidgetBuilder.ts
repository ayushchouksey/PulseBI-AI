import type {
    KPI,
  } from "@pulsebi/shared-types";
  
  import type {
    DashboardWidget,
  } from "./types.js";
  
  export class KPIWidgetBuilder {
  
    execute(
      kpis: KPI[]
    ): DashboardWidget[] {
  
      return kpis.map(kpi => ({
  
        id:
          `kpi-${kpi.name.toLowerCase()}`,
  
        title:
          kpi.name,
  
        type: "kpi",
  
        config: {
  
          aggregation:
            kpi.aggregation,
  
        },
  
      }));
  
    }
  
  }