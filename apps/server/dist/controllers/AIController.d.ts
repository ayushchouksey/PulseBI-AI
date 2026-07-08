import type { Request, Response } from "express";
export declare class AIController {
    private readonly service;
    ask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
