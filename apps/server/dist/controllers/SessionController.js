import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class SessionController {
    create = async (_req, res) => {
        return res.json(buildSuccessResponse({
            sessionId: crypto.randomUUID(),
        }, "Session created"));
    };
}
//# sourceMappingURL=SessionController.js.map