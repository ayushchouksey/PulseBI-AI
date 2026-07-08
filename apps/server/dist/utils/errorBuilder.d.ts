import type { ErrorModel } from "@pulsebi/shared-types";
export declare function buildErrorResponse(error: unknown): {
    statusCode: number;
    errors: ErrorModel[];
};
