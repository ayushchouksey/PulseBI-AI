import type { Request, Response } from "express";
export declare class DashboardController {
    private readonly service;
    generate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
