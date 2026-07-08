import { StatisticsService } from "../services/StatisticsService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class StatisticsController {
    service = new StatisticsService();
    get = async (req, res) => {
        const datasetId = Array.isArray(req.params.datasetId)
            ? req.params.datasetId[0] // Extract the first string if it's an array
            : req.params.datasetId;
        const result = await this.service.generateStatistics(datasetId);
        return res.json(buildSuccessResponse(result, "Statistics generated"));
    };
}
//# sourceMappingURL=StatisticsController.js.map