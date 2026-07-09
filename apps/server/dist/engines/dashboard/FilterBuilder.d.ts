import type { ColumnMetadata } from "@pulsebi/shared-types";
import type { DashboardFilter } from "./types.js";
export declare class FilterBuilder {
    execute(metadata: ColumnMetadata[]): DashboardFilter[];
}
