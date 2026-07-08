import type { ColumnQuality, Dataset } from "@pulsebi/shared-types";
export declare class ColumnAnalyzer {
    execute(dataset: Dataset, columns: ColumnQuality[]): ColumnQuality[];
}
