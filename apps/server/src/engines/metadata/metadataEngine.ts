import type { DatasetMetadata, ColumnMetadata } from "@pulsebi/shared-types";

export interface MetadataEngineResult {
  metadata: DatasetMetadata;
  measureColumns: ColumnMetadata[];
  dimensionColumns: ColumnMetadata[];
  dateColumns: ColumnMetadata[];
  columnMap: Map<string, ColumnMetadata>;
}

export function detectMetadata(fullMetadata: DatasetMetadata): MetadataEngineResult {
  const columns = fullMetadata.columns;
  const measureColumns = columns.filter((c) => c.role === "measure");
  const dimensionColumns = columns.filter((c) => c.role === "dimension");
  const dateColumns = columns.filter((c) => c.detectedType === "date");
  const columnMap = new Map(columns.map((c) => [c.name, c]));

  return {
    metadata: fullMetadata,
    measureColumns,
    dimensionColumns,
    dateColumns,
    columnMap,
  };
}

export function detectColumnFormat(col: ColumnMetadata): string | undefined {
  if (col.detectedType === "currency" || col.name.toLowerCase().includes("revenue") || col.name.toLowerCase().includes("price")) {
    return "currency";
  }
  if (col.detectedType === "percentage") return "percentage";
  if (col.detectedType === "date") return "date";
  if (col.detectedType === "integer" || col.detectedType === "decimal") return "number";
  return undefined;
}
