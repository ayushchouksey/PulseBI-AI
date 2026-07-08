import type { Request, Response } from "express";
export declare class SessionController {
    private readonly service;
    create: (_req: Request, res: Response) => Response<any, Record<string, any>>;
}
