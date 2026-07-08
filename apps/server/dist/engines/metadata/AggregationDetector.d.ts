import type { AggregationType, BusinessRole, ColumnType } from "@pulsebi/shared-types";
export declare class AggregationDetector {
    execute(columnName: string, columnType: ColumnType, businessRole: BusinessRole): AggregationType;
}
