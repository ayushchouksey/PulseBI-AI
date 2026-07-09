import type { Request, Response } from "express";
export declare class SessionController {
    create: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
