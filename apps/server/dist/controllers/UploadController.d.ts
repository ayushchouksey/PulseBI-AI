import type { Request, Response } from "express";
export declare class UploadController {
    private readonly service;
    upload: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
