import { StatisticsService } from "../services/StatisticsService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class StatisticsController {
    service = new StatisticsService();
    getStatistics = async (req, res) => {
        const datasetId = Array.isArray(req.params.datasetId)
            ? req.params.datasetId[0] // Extract the first string if it's an array
            : req.params.datasetId;
        const statistics = await this.service.getStatistics(datasetId);
        return res.json(buildSuccessResponse(statistics, "Statistics retrieved successfully"));
    };
}
//# sourceMappingURL=StatisticsController.js.map