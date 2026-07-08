import type { ApiResponse } from "@pulsebi/shared-types";
export declare function buildSuccessResponse<T>(data: T, message?: string, requestId?: string): ApiResponse<T>;
