import { DatasetRepository } from "../repositories/index.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class SessionController {
    create = async (_req, res) => {
        return res.json(buildSuccessResponse({
            sessionId: crypto.randomUUID(),
        }, "Session created"));
    };
    repository = DatasetRepository.getInstance();
    getSession(datasetId) {
        return this.repository.findById(datasetId);
    }
}
//# sourceMappingURL=SessionController.js.map