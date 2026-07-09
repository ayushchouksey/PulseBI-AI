import type { ColumnMetadata, Dataset, DataQualityReport, DatasetStatistics } from "@pulsebi/shared-types";
import type { StoredDataset } from "./types.js";
export declare class DatasetRepository {
    private static instance;
    private readonly datasets;
    private constructor();
    static getInstance(): DatasetRepository;
    save(input: {
        dataset: Dataset;
        metadata: ColumnMetadata[];
        quality: DataQualityReport;
        statistics: DatasetStatistics;
    }): StoredDataset;
    findById(datasetId: string): StoredDataset | undefined;
    findAll(): StoredDataset[];
    updateMetadata(datasetId: string, metadata: ColumnMetadata[], statistics: DatasetStatistics): StoredDataset | undefined;
    delete(datasetId: string): boolean;
}
