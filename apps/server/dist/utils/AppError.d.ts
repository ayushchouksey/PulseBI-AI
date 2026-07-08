import type { ErrorModel } from "@pulsebi/shared-types";
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly errors?: ErrorModel[] | string[];
    constructor(message: string, statusCode?: number, errors?: ErrorModel[] | string[], code?: string);
}
