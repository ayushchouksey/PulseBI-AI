import { z } from 'zod';
const columnOverrideSchema = z.object({
    id: z.uuid(),
    displayName: z.string().min(1),
    dataType: z.enum([
        'text',
        'number',
        'currency',
        'percentage',
        'date',
        'datetime',
        'boolean',
        'email',
        'phone',
        'url',
        'unknown',
    ]),
    businessRole: z.enum([
        'metric',
        'dimension',
        'date',
        'identifier',
        'location',
        'category',
        'ignore',
    ]),
    aggregation: z.enum([
        'SUM',
        'AVG',
        'COUNT',
        'COUNT_DISTINCT',
        'MIN',
        'MAX',
        'NONE',
    ]),
    visible: z.boolean(),
});
export const updateMetadataSchema = z.object({
    columns: z.array(columnOverrideSchema),
    datasetId: z.uuid(),
    metadata: z.record(z.string(), z.unknown())
});
//# sourceMappingURL=metadata.validator.js.map