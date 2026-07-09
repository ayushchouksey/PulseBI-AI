import type { Dataset, ColumnMetadata, DatasetStatistics } from "@pulsebi/shared-types";
import type { DashboardDefinition } from "./types.js";
import type { Engine } from "../../core/engine.interface.js";
export declare class DashboardEngine implements Engine<{
    dataset: Dataset;
    metadata: ColumnMetadata[];
    statistics: DatasetStatistics;
}, DashboardDefinition> {
    private readonly kpis;
    private readonly charts;
    private readonly filters;
    private readonly layout;
    execute(input: {
        dataset: Dataset;
        metadata: ColumnMetadata[];
        statistics: DatasetStatistics;
    }): DashboardDefinition;
}
