import { z } from 'zod';

export const dashboardValidator =
z.object({

 datasetId:
   z.string()
   .uuid(),


 configuration:
   z.record(
     z.string(),
     z.unknown()
   )
   .optional()

});

export const generateDashboardSchema = z.object({
  datasetId: z.uuid('Invalid dataset ID'),
  metadata: z.record(z.any(), z.string()).optional(),
});

export const updateDashboardSchema = z.object({
  dashboardId: z.string().uuid('Invalid dashboard ID'),
  title: z.string().min(1, 'Title must not be empty'),
  widgets: z.array(z.any()).default([]),
  filters: z.array(z.any()).default([]),
  layout: z.record(z.any(), z.string()).default({}),
  theme: z.union([z.string(), z.record(z.any(), z.string())]).default('default'),
});

export const createWidgetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['KPI', 'chart', 'table', 'summary', 'text', 'filter']),
  chartType: z.string().optional(),
  dataSource: z.string().min(1, 'DataSource is required'),
  configuration: z.record(z.any(), z.string()).default({}),
});

export const updateWidgetSchema = z.object({
  title: z.string().optional(),
  visible: z.boolean().optional(),
  configuration: z.record(z.any(), z.string()).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  }).optional(),
});
