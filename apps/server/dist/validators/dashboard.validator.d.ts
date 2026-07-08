import { z } from 'zod';
export declare const dashboardValidator: z.ZodObject<{
    datasetId: z.ZodString;
    configuration: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const generateDashboardSchema: z.ZodObject<{
    datasetId: z.ZodUUID;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodAny, z.ZodString>>;
}, z.core.$strip>;
export declare const updateDashboardSchema: z.ZodObject<{
    dashboardId: z.ZodString;
    title: z.ZodString;
    widgets: z.ZodDefault<z.ZodArray<z.ZodAny>>;
    filters: z.ZodDefault<z.ZodArray<z.ZodAny>>;
    layout: z.ZodDefault<z.ZodRecord<z.ZodAny, z.ZodString>>;
    theme: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodAny, z.ZodString>]>>;
}, z.core.$strip>;
export declare const createWidgetSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<{
        text: "text";
        filter: "filter";
        chart: "chart";
        table: "table";
        KPI: "KPI";
        summary: "summary";
    }>;
    chartType: z.ZodOptional<z.ZodString>;
    dataSource: z.ZodString;
    configuration: z.ZodDefault<z.ZodRecord<z.ZodAny, z.ZodString>>;
}, z.core.$strip>;
export declare const updateWidgetSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    visible: z.ZodOptional<z.ZodBoolean>;
    configuration: z.ZodOptional<z.ZodRecord<z.ZodAny, z.ZodString>>;
    position: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
