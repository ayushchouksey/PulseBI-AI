import type { Request, Response } from "express";
export declare class HealthController {
    health: (_req: Request, res: Response) => Response<any, Record<string, any>>;
}
