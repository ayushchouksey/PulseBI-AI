import type { Dataset, ColumnMetadata, DatasetStatistics, DataQualityReport } from "@pulsebi/shared-types";
import type { Engine } from "../../core/engine.interface.js";
export declare class StatisticsEngine implements Engine<{
    dataset: Dataset;
    metadata: ColumnMetadata[];
}, DatasetStatistics> {
    private readonly profiler;
    private readonly summary;
    private readonly aggregation;
    private readonly trends;
    private readonly rankings;
    private readonly distributions;
    private readonly kpis;
    execute(input: {
        dataset: Dataset;
        metadata: ColumnMetadata[];
        quality: DataQualityReport;
    }): DatasetStatistics;
}
