import { DatasetRepository } from "../repositories/index.js";
import { DashboardEngine } from "../engines/dashboard/index.js";
import { ExportEngine } from "../engines/export/index.js";
export class ExportService {
    repository = DatasetRepository.getInstance();
    dashboardEngine = new DashboardEngine();
    exportEngine = new ExportEngine();
    async exportDashboard(datasetId, format) {
        const stored = this.repository.findById(datasetId);
        if (!stored) {
            throw new Error("Dataset not found.");
        }
        const dashboard = this.dashboardEngine.execute({
            dataset: stored.dataset,
            metadata: stored.metadata,
            statistics: stored.statistics,
        });
        return this.exportEngine.execute({
            dashboard,
            format
        });
    }
}
//# sourceMappingURL=ExportService.js.map