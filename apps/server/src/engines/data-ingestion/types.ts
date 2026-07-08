export type {
    Dataset,
    RawDataset,
    CellValue
  } from "@pulsebi/shared-types";  

export interface ValidationResult {
  valid: boolean;

  errors: string[];

  warnings: string[];
}

export interface ParseOptions {
  delimiter: string;

  hasHeader: boolean;
}