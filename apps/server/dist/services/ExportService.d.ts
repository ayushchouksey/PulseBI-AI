export declare class ExportService {
    private readonly repository;
    private readonly dashboardEngine;
    private readonly exportEngine;
    exportDashboard(datasetId: string, format: "json" | "pdf" | "csv"): Promise<Buffer<ArrayBufferLike>>;
}
