import type { ColumnMetadata } from "@pulsebi/shared-types";
import type { DashboardWidget } from "./types.js";
export declare class ChartRecommendationEngine {
    execute(metadata: ColumnMetadata[]): DashboardWidget[];
}
