export function buildSuccessResponse(data, message = "Success", requestId = "") {
    return {
        "success": true,
        data,
        message,
        "errors": [],
        requestId,
        "timestamp": ""
    };
}
//# sourceMappingURL=responseBuilder.js.map