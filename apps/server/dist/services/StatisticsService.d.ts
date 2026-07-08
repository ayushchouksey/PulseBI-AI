export declare class StatisticsService {
    generateStatistics(datasetId: string): Promise<{
        datasetId: string;
        statistics: {};
        rowCount: number;
        columnCount: number;
        missingValues: number;
        duplicateRows: number;
        generatedAt: string;
        metrics: {
            column: string;
            sum: number;
            average: number;
            minimum: number;
            maximum: number;
            median: number;
            count: number;
            stdDeviation: number;
            variance: number;
        }[];
        trends: {
            dimension: string;
            metric: string;
            values: {
                key: string;
                value: number;
            }[];
        }[];
    }>;
}
