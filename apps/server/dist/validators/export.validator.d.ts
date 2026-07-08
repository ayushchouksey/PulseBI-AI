import { z } from 'zod';
export declare const exportValidator: z.ZodObject<{
    dashboardId: z.ZodUUID;
    format: z.ZodEnum<{
        png: "png";
        svg: "svg";
        pdf: "pdf";
        csv: "csv";
        xlsx: "xlsx";
    }>;
}, z.core.$strip>;
export declare const exportDashboardSchema: z.ZodObject<{
    format: z.ZodEnum<{
        png: "png";
        svg: "svg";
        pdf: "pdf";
    }>;
    target: z.ZodEnum<{
        dashboard: "dashboard";
    }>;
    filtersApplied: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const exportChartSchema: z.ZodObject<{
    chartId: z.ZodUUID;
    format: z.ZodEnum<{
        png: "png";
        svg: "svg";
    }>;
    filtersApplied: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const exportTableSchema: z.ZodObject<{
    datasetId: z.ZodUUID;
    format: z.ZodEnum<{
        csv: "csv";
        xlsx: "xlsx";
    }>;
    filtersApplied: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
