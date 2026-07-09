import { AIService } from "../services/AIService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class AIController {
    service = new AIService();
    ask = async (req, res) => {
        const result = await this.service.ask(req.body.datasetId, req.body.question);
        return res.json(buildSuccessResponse(result, "AI response generated"));
    };
}
//# sourceMappingURL=AIController.js.map