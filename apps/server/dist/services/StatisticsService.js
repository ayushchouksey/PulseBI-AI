import { DatasetRepository } from "../repositories/index.js";
export class StatisticsService {
    repository = DatasetRepository.getInstance();
    async getStatistics(datasetId) {
        const stored = this.repository.findById(datasetId);
        if (!stored) {
            throw new Error("Dataset not found.");
        }
        return stored.statistics;
    }
}
//# sourceMappingURL=StatisticsService.js.map