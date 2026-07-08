import { ExportService } from "../services/ExportService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class ExportController {
    service = new ExportService();
    export = async (req, res) => {
        const result = await this.service.exportDashboard(req.body.dashboardId);
        return res.json(buildSuccessResponse(result, "Export completed"));
    };
}
//# sourceMappingURL=ExportController.js.map