import type { Request, Response, NextFunction } from "express";
export declare const requestId: (req: Request, res: Response, next: NextFunction) => void;
