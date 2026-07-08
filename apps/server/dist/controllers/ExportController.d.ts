import type { Request, Response } from "express";
export declare class ExportController {
    private readonly service;
    export: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
