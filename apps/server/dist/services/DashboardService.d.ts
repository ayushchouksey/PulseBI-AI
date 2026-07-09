import type { DashboardDefinition } from "../engines/dashboard/types.js";
export declare class DashboardService {
    private readonly repository;
    private readonly dashboardEngine;
    generateDashboard(datasetId: string): Promise<DashboardDefinition>;
    getDashboard(datasetId: string): Promise<DashboardDefinition>;
    regenerateDashboard(datasetId: string): Promise<DashboardDefinition>;
}
