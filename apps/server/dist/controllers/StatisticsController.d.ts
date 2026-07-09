import type { Request, Response } from "express";
export declare class StatisticsController {
    private readonly service;
    getStatistics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
