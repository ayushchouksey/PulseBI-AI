import { z } from 'zod';
export declare const aiQueryValidator: z.ZodObject<{
    datasetId: z.ZodUUID;
    question: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
    dashboardContext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const aiQuerySchema: z.ZodObject<{
    question: z.ZodString;
    dashboardContext: z.ZodDefault<z.ZodRecord<z.ZodAny, z.ZodString>>;
    conversationContext: z.ZodOptional<z.ZodRecord<z.ZodAny, z.ZodString>>;
}, z.core.$strip>;
export declare const aiSummarySchema: z.ZodObject<{
    datasetId: z.ZodUUID;
}, z.core.$strip>;
export declare const aiRecommendationsSchema: z.ZodObject<{
    datasetId: z.ZodUUID;
}, z.core.$strip>;
