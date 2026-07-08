import { DashboardModel } from '@pulsebi/shared-types';
export declare class DashboardService {
    private engine;
    generateInitialDashboard(datasetId?: string, _metadata?: any): Promise<DashboardModel>;
    generateDashboard(_datasetId: string): Promise<DashboardModel>;
    updateDashboard(dashboardId: string, updateData: any): Promise<DashboardModel>;
}
