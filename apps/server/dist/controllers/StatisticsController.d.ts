import type { Request, Response } from "express";
export declare class StatisticsController {
    private readonly service;
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
