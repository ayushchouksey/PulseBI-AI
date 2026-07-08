import type { Request, Response } from "express";
export declare class HealthController {
    static getHealth(_req: Request, res: Response): Promise<void>;
}
