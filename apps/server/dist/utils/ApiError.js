export class AppError extends Error {
    statusCode;
    code;
    errors;
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", errors) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
//# sourceMappingURL=ApiError.js.map