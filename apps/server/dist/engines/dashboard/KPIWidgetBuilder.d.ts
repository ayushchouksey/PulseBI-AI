import type { KPI } from "@pulsebi/shared-types";
import type { DashboardWidget } from "./types.js";
export declare class KPIWidgetBuilder {
    execute(kpis: KPI[]): DashboardWidget[];
}
