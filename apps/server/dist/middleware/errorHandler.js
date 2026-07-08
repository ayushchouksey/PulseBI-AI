import { ZodError } from "zod";
import { logger } from "../utils/logger.js";
import { buildErrorResponse } from "../utils/errorBuilder.js";
export const errorHandler = (error, req, res, _next) => {
    logger.error({
        error,
        path: req.path,
        method: req.method
    }, "Request failed");
    // Zod validation error
    if (error instanceof ZodError) {
        res.status(400)
            .json({
            success: false,
            errors: error.issues.map(issue => ({
                code: "VALIDATION_ERROR",
                message: issue.message,
                field: issue.path.join(".")
            })),
            requestId: req.headers["x-request-id"],
            timestamp: new Date().toISOString()
        });
        return;
    }
    const response = buildErrorResponse(error);
    res
        .status(response.statusCode)
        .json({
        success: false,
        errors: response.errors,
        requestId: req.headers["x-request-id"],
        timestamp: new Date().toISOString()
    });
};
//# sourceMappingURL=errorHandler.js.map