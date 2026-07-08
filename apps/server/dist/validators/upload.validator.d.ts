import { z } from 'zod';
export declare const uploadRequestSchema: z.ZodObject<{
    file: z.ZodOptional<z.ZodAny>;
    filename: z.ZodString;
    mimetype: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
