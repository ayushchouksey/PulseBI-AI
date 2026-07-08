import type { ColumnQuality, QualityIssue } from "@pulsebi/shared-types";
export declare class QualityScoreCalculator {
    execute(columns: ColumnQuality[], duplicateRows: number, issues: QualityIssue[]): number;
}
