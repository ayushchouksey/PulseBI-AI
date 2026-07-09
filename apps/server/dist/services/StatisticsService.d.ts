export declare class StatisticsService {
    private readonly repository;
    getStatistics(datasetId: string): Promise<import("@pulsebi/shared-types").DatasetStatistics>;
}
