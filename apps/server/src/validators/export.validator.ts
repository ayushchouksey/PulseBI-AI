import { z } from 'zod';

export const exportValidator =
z.object({

 dashboardId:
   z.uuid(),


 format:
 z.enum([
   "png",
   "svg",
   "pdf",
   "csv",
   "xlsx"
 ])

});

export const exportDashboardSchema = z.object({
  format: z.enum(['pdf', 'png', 'svg']),
  target: z.enum(['dashboard']),
  filtersApplied: z.boolean().default(true),
});

export const exportChartSchema = z.object({
  chartId: z.uuid(),
  format: z.enum(['png', 'svg']),
  filtersApplied: z.boolean().default(true),
});

export const exportTableSchema = z.object({
  datasetId: z.uuid(),
  format: z.enum(['csv', 'xlsx']),
  filtersApplied: z.boolean().default(true),
});
