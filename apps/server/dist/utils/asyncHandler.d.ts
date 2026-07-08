import type { Request, Response, NextFunction } from "express";
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => void;
