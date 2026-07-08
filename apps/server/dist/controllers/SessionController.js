import { SessionService } from "../services/SessionService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class SessionController {
    service = new SessionService();
    create = (_req, res) => {
        const id = this.service.createSession();
        return res.json(buildSuccessResponse({ sessionId: id }, "Session created"));
    };
}
//# sourceMappingURL=SessionController.js.map