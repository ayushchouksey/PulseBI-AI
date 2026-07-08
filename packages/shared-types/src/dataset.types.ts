export type CellValue =
  | string
  | number
  | boolean
  | Date
  | null;

export interface RawDataset {
  headers: string[];
  rows: string[][];
  rowCount: number;
}

export interface Dataset {
  id: string;

  fileName: string;

  delimiter: string;

  encoding: string;

  uploadedAt: Date;

  headers: string[];

  rows: Record<string, CellValue>[];

  totalRows: number;

  totalColumns: number;
}