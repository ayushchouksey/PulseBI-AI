import type {
    ColumnQuality,
    DataQualityReport,
    QualityIssue,
  } from "@pulsebi/shared-types";
  
  export interface HeaderValidationResult {
    issues: QualityIssue[];
  }
  
  export interface RowValidationResult {
    issues: QualityIssue[];
    emptyRows: number;
  }
  
  export interface MissingValueResult {
    columns: ColumnQuality[];
  }
  
  export interface DuplicateResult {
    duplicateRows: number;
  }
  
  export type QualityReport = DataQualityReport;