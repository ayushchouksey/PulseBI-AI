import type { Dataset, ColumnMetadata, DatasetStatistics } from "@pulsebi/shared-types";
import type { Engine } from "../../core/engine.interface.js";
import type { DashboardDefinition } from "./types.js";
export declare class DashboardEngine implements Engine<{
    dataset: Dataset;
    metadata: ColumnMetadata[];
    statistics: DatasetStatistics;
}, DashboardDefinition> {
    private readonly kpiBuilder;
    private readonly chartEngine;
    execute(input: {
        dataset: Dataset;
        metadata: ColumnMetadata[];
        statistics: DatasetStatistics;
    }): DashboardDefinition;
}
