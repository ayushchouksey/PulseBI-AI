import type { ColumnMetadata, DatasetStatistics } from "@pulsebi/shared-types";
export declare class MetadataService {
    /**
     * Temporary implementation.
     *
     * Once DatasetRepository is added, this method will:
     * 1. Load dataset by id
     * 2. Replace metadata
     * 3. Recalculate statistics
     * 4. Save dataset
     */
    updateMetadata(datasetId: string, metadata: ColumnMetadata[]): Promise<{
        datasetId: string;
        metadata: ColumnMetadata[];
        statistics: DatasetStatistics | null;
        success: boolean;
    }>;
}
