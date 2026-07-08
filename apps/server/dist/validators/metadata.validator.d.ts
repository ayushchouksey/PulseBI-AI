import { z } from 'zod';
export declare const updateMetadataSchema: z.ZodObject<{
    columns: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        displayName: z.ZodString;
        dataType: z.ZodEnum<{
            number: "number";
            boolean: "boolean";
            text: "text";
            date: "date";
            percentage: "percentage";
            currency: "currency";
            url: "url";
            unknown: "unknown";
            datetime: "datetime";
            email: "email";
            phone: "phone";
        }>;
        businessRole: z.ZodEnum<{
            date: "date";
            metric: "metric";
            category: "category";
            identifier: "identifier";
            ignore: "ignore";
            dimension: "dimension";
            location: "location";
        }>;
        aggregation: z.ZodEnum<{
            SUM: "SUM";
            AVG: "AVG";
            COUNT: "COUNT";
            COUNT_DISTINCT: "COUNT_DISTINCT";
            MIN: "MIN";
            MAX: "MAX";
            NONE: "NONE";
        }>;
        visible: z.ZodBoolean;
    }, z.core.$strip>>;
    datasetId: z.ZodUUID;
    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
