export declare class ExportService {
    private engine;
    exportDashboard(dashboardId: string): Promise<{
        dashboardId: string;
        url: string;
    }>;
}
