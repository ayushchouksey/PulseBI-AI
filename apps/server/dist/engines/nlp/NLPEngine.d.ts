import type { Dataset, ColumnMetadata, DatasetStatistics } from "@pulsebi/shared-types";
import type { Engine } from "../../core/engine.interface.js";
export declare class NLPEngine implements Engine<{
    dataset: Dataset;
    metadata: ColumnMetadata[];
    statistics: DatasetStatistics;
    question: string;
}, unknown> {
    execute(input: {
        dataset: Dataset;
        metadata: ColumnMetadata[];
        statistics: DatasetStatistics;
        question: string;
    }): {
        type: string;
        answer: import("@pulsebi/shared-types").KPI[];
    } | {
        type: string;
        answer: ColumnMetadata[];
    } | {
        type: string;
        answer: {
            rows: number;
            columns: number;
            kpis: number;
        };
    };
}
