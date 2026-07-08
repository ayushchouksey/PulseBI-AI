import type { Request, Response } from "express";
export declare class MetadataController {
    private readonly service;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
