import type { ColumnMetadata } from "@pulsebi/shared-types";
export declare class MetadataService {
    private readonly repository;
    private readonly statisticsEngine;
    updateMetadata(datasetId: string, metadata: ColumnMetadata[]): Promise<import("../repositories/types.js").StoredDataset | undefined>;
}
