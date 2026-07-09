import { DatasetRepository } from "../repositories/index.js";
import { DashboardEngine } from "../engines/dashboard/index.js";
export class DashboardService {
    repository = DatasetRepository.getInstance();
    dashboardEngine = new DashboardEngine();
    async generateDashboard(datasetId) {
        const stored = this.repository.findById(datasetId);
        if (!stored) {
            throw new Error("Dataset not found.");
        }
        return this.dashboardEngine.execute({
            dataset: stored.dataset,
            metadata: stored.metadata,
            statistics: stored.statistics,
        });
    }
    async getDashboard(datasetId) {
        return this.generateDashboard(datasetId);
    }
    async regenerateDashboard(datasetId) {
        return this.generateDashboard(datasetId);
    }
}
//# sourceMappingURL=DashboardService.js.map