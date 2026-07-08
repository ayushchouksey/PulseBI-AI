import { generateUUID } from "../utils/uuid.util.js";
export const requestId = (req, res, next) => {
    const id = generateUUID();
    req.headers["x-request-id"] = id;
    res.setHeader("x-request-id", id);
    next();
};
//# sourceMappingURL=requestId.js.map