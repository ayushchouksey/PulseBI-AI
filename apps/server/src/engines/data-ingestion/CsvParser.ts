import Papa from "papaparse";

import type { RawDataset } from "./types.js";

export class CsvParser {
  public parse(
    buffer: Buffer,
    delimiter: string
  ): RawDataset {

    const csvContent = buffer.toString("utf-8");

    const result = Papa.parse<string[]>(csvContent, {
      delimiter,
      skipEmptyLines: true,
      dynamicTyping: false,
      transform: (value:string) => value.trim(),
    });

    if (result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    const data = result.data;

    if (data.length === 0) {
      throw new Error("CSV file contains no data.");
    }

    const headers = data[0];

    const rows = data.slice(1);

    return {
      headers,
      rows,
      rowCount: rows.length,
    };
  }
}