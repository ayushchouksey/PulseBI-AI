import type { Dataset, QualityIssue } from "@pulsebi/shared-types";
export declare class HeaderValidator {
    execute(dataset: Dataset): QualityIssue[];
}
