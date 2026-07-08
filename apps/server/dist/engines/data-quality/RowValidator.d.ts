import type { Dataset, QualityIssue } from "@pulsebi/shared-types";
export declare class RowValidator {
    execute(dataset: Dataset): {
        issues: QualityIssue[];
        emptyRows: number;
    };
}
