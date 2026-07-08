import { AppError } from "./AppError.js";
export function buildErrorResponse(error) {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            errors: [
                {
                    code: error.code,
                    message: error.message
                }
            ]
        };
    }
    return {
        statusCode: 500,
        errors: [
            {
                code: "INTERNAL_ERROR",
                message: "Something went wrong"
            }
        ]
    };
}
//# sourceMappingURL=errorBuilder.js.map