import { z } from 'zod';

export const uploadRequestSchema = z.object({
  // Typically handled by Multer middleware, stub schema can remain simple
  file: z.any().optional(),
  filename:
    z.string()
    .min(1),

  mimetype:
    z.string()
    .optional()
});
