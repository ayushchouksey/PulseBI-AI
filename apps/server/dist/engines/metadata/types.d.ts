import type { AggregationType, BusinessRole, ColumnMetadata, ColumnType } from "@pulsebi/shared-types";
export interface DetectedColumn {
    originalName: string;
    displayName: string;
    detectedType: ColumnType;
    businessRole: BusinessRole;
    aggregation: AggregationType;
    confidence: number;
    sampleValues: string[];
}
export interface MetadataBuildContext {
    columns: DetectedColumn[];
}
export interface ColumnAnalysisInput {
    name: string;
    values: unknown[];
}
export type MetadataResult = ColumnMetadata[];
