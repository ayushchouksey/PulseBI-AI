import type { ColumnQuality, Dataset } from "@pulsebi/shared-types";
export declare class MissingValueAnalyzer {
    execute(dataset: Dataset): ColumnQuality[];
}
