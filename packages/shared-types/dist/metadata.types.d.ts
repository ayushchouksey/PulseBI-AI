export type DataType = "string" | "number" | "date" | "boolean";
export type BusinessRole = "metric" | "category" | "date" | "identifier" | "ignore";
export interface DatasetMetadata {
    datasetId: string;
    columns: ColumnMetadata[];
}
export interface MetadataColumn {
    name: string;
    displayName: string;
    dataType: string;
    businessRole: string;
    aggregation?: string;
    confidence: number;
    visible: boolean;
}
export interface MetadataResponse {
    datasetId: string;
    columns: MetadataColumn[];
}
export type ColumnType = "text" | "number" | "date" | "boolean";
export type AggregationType = "sum" | "avg" | "count" | "min" | "max" | "none";
export interface ColumnMetadata {
    originalName: string;
    displayName: string;
    detectedType: ColumnType;
    businessRole: BusinessRole;
    aggregation: AggregationType;
    visible: boolean;
    confidence: number;
    sampleValues: string[];
}
//# sourceMappingURL=metadata.types.d.ts.map