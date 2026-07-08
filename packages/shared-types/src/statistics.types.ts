import type {
  AggregationType,
  ColumnType,
} from "./metadata.types.js";

/**
 * Root statistics model returned by the Statistics Engine.
 */
export interface DatasetStatistics {
  rowCount: number;

  columnCount: number;

  summary: DatasetSummary;

  columnStatistics: ColumnStatistic[];

  kpis: KPI[];

  trends: Trend[];

  rankings: Ranking[];

  distributions: Distribution[];
}

/**
 * Overall dataset summary.
 */
export interface DatasetSummary {
  totalRows: number;

  totalColumns: number;

  numericColumns: number;

  categoryColumns: number;

  dateColumns: number;

  missingValues: number;

  duplicateRows: number;
}

/**
 * Statistics for an individual column.
 */
export interface ColumnStatistic {
  column: string;

  dataType: ColumnType;

  count: number;

  missingValues: number;

  uniqueValues: number;

  minimum?: number;

  maximum?: number;

  average?: number;

  sum?: number;
}

/**
 * KPI Card model.
 */
export interface KPI {
  name: string;

  value: number;

  aggregation: AggregationType;

  format?: "number" | "currency" | "percentage";

  description?: string;
}

/**
 * Line / Area chart dataset.
 */
export interface Trend {
  name: string;

  x: string[];

  y: number[];
}

/**
 * Bar chart dataset.
 */
export interface Ranking {
  name: string;

  labels: string[];

  values: number[];
}

/**
 * Pie / Donut chart dataset.
 */
export interface Distribution {
  name: string;

  labels: string[];

  values: number[];
}