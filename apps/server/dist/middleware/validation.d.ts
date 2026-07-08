import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
export declare const validateBody: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateParams: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validate: (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => void;
