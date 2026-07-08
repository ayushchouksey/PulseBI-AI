import { ExportEngine } from "../engines/export/ExportEngine.js";
export class ExportService {
    engine = new ExportEngine();
    async exportDashboard(dashboardId) {
        await this.engine.export({});
        return {
            dashboardId,
            url: "/exports/dashboard.pdf"
        };
    }
}
//# sourceMappingURL=ExportService.js.map