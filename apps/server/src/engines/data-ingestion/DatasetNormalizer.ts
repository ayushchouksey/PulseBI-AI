import { randomUUID } from "node:crypto";

import type {
  Dataset,
  RawDataset,
  CellValue,
} from "./types.js";

export class DatasetNormalizer {

  public normalize(
    rawDataset: RawDataset,
    fileName: string,
    delimiter: string
  ): Dataset {

    const rows: Record<string, CellValue>[] = [];

    for (const row of rawDataset.rows) {

      const record: Record<string, CellValue> = {};

      rawDataset.headers.forEach((header, index) => {

        record[header] = this.convertValue(
          row[index] ?? null
        );

      });

      rows.push(record);

    }

    return {

      id: randomUUID(),

      fileName,

      delimiter,

      encoding: "utf-8",

      uploadedAt: new Date(),

      headers: rawDataset.headers,

      rows,

      totalRows: rows.length,

      totalColumns: rawDataset.headers.length,

    };

  }

  private convertValue(
    value: string | null
  ): CellValue {

    if (value === null || value === undefined) {
      return null;
    }

    const trimmed = value.trim();

    if (trimmed === "") {
      return null;
    }

    // Boolean
    if (trimmed.toLowerCase() === "true") {
      return true;
    }

    if (trimmed.toLowerCase() === "false") {
      return false;
    }

    // Number
    const numericValue = Number(trimmed);

    if (!Number.isNaN(numericValue) && trimmed !== "") {
      return numericValue;
    }

    // Date
    const date = new Date(trimmed);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }

    // Default: String
    return trimmed;

  }

}