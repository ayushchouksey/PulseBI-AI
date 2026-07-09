export class DatasetRepository {
    static instance;
    datasets = new Map();
    constructor() { }
    static getInstance() {
        if (!DatasetRepository.instance) {
            DatasetRepository.instance =
                new DatasetRepository();
        }
        return DatasetRepository.instance;
    }
    save(input) {
        const stored = {
            dataset: input.dataset,
            metadata: input.metadata,
            quality: input.quality,
            statistics: input.statistics,
            uploadedAt: new Date(),
        };
        this.datasets.set(input.dataset.id, stored);
        return stored;
    }
    findById(datasetId) {
        return this.datasets.get(datasetId);
    }
    findAll() {
        return Array.from(this.datasets.values());
    }
    exists(datasetId) {
        return this.datasets.has(datasetId);
    }
    updateMetadata(datasetId, metadata, statistics) {
        const stored = this.datasets.get(datasetId);
        if (!stored) {
            return undefined;
        }
        stored.metadata = metadata;
        stored.statistics = statistics;
        return stored;
    }
    delete(datasetId) {
        return this.datasets.delete(datasetId);
    }
    clear() {
        this.datasets.clear();
    }
}
//# sourceMappingURL=DatasetRepository.js.map