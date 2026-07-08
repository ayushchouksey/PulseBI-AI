import { z } from 'zod';

export const aiQueryValidator =
z.object({

 datasetId:
   z.uuid(),


 question:
   z.string()
   .min(1),


 conversationId:
   z.string()
   .optional(),


 dashboardContext:
   z.record(
     z.string(),
     z.unknown()
   )
   .optional()

});

export const aiQuerySchema = z.object({
  question: z.string().min(1, 'Question is required'),
  dashboardContext: z.record(z.any(), z.string()).default({}),
  conversationContext: z.record(z.any(), z.string()).optional(),
});

export const aiSummarySchema = z.object({
  datasetId: z.uuid('Invalid dataset ID'),
});

export const aiRecommendationsSchema = z.object({
  datasetId: z.uuid('Invalid dataset ID'),
});
