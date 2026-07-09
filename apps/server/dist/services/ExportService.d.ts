export declare class ExportService {
    private readonly repository;
    private readonly dashboardEngine;
    private readonly exportEngine;
    exportDashboard(datasetId: string): Promise<Buffer<ArrayBufferLike>>;
}
