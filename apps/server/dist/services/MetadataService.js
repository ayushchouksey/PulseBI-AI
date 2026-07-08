export class MetadataService {
    /**
     * Temporary implementation.
     *
     * Once DatasetRepository is added, this method will:
     * 1. Load dataset by id
     * 2. Replace metadata
     * 3. Recalculate statistics
     * 4. Save dataset
     */
    async updateMetadata(datasetId, metadata) {
        return {
            datasetId,
            metadata,
            statistics: null,
            success: true,
        };
    }
}
//# sourceMappingURL=MetadataService.js.map