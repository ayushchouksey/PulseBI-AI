export declare class AIService {
    private readonly repository;
    private readonly engine;
    ask(datasetId: string, question: string): Promise<{
        type: string;
        answer: import("@pulsebi/shared-types").KPI[];
    } | {
        type: string;
        answer: import("@pulsebi/shared-types").ColumnMetadata[];
    } | {
        type: string;
        answer: {
            rows: number;
            columns: number;
            kpis: number;
        };
    }>;
}
