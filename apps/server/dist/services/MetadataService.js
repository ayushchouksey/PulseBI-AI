import { DatasetRepository } from "../repositories/index.js";
import { StatisticsEngine } from "../engines/statistics/index.js";
export class MetadataService {
    repository = DatasetRepository.getInstance();
    statisticsEngine = new StatisticsEngine();
    async updateMetadata(datasetId, metadata) {
        const stored = this.repository.findById(datasetId);
        if (!stored) {
            throw new Error("Dataset not found.");
        }
        const statistics = this.statisticsEngine.execute({
            dataset: stored.dataset,
            metadata,
            quality: stored.quality,
        });
        const updated = this.repository.updateMetadata(datasetId, metadata, statistics);
        return updated;
    }
}
//# sourceMappingURL=MetadataService.js.map