import type { Request, Response } from "express";
export declare class ConfigController {
    get: (_req: Request, res: Response) => Response<any, Record<string, any>>;
}
