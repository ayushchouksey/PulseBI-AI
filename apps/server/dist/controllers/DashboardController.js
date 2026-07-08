import { DashboardService } from "../services/DashboardService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class DashboardController {
    service = new DashboardService();
    generate = async (req, res) => {
        const result = await this.service.generateDashboard(req.body.datasetId);
        return res.json(buildSuccessResponse(result, "Dashboard generated"));
    };
}
//# sourceMappingURL=DashboardController.js.map