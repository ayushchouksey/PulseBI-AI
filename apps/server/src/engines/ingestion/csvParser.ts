import fs from "fs";
import Papa from "papaparse";
import type { DatasetMetadata, ColumnMetadata, ColumnType, ColumnRole } from "@pulsebi/shared-types";
import { generateId } from "@pulsebi/shared-utils";

export interface RawCSVData {
  columns: string[];
  rows: Record<string, unknown>[];
  metadata: DatasetMetadata;
}

export function parseCSV(filePath: string, filename: string): RawCSVData {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const result = Papa.parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimitersToGuess: [",", "\t", "|", ";"],
  });

  if (result.errors.length > 0) {
    console.warn("CSV parse warnings:", result.errors.slice(0, 5));
  }

  const columns = result.meta.fields || [];
  const rows = result.data as Record<string, unknown>[];

  const columnMetadata: ColumnMetadata[] = columns.map((col) => {
    const values = rows.map((r) => r[col]);
    const nonEmpty = values.filter((v) => v !== null && v !== undefined && v !== "");
    const detectedType = inferColumnType(values);
    const uniqueCount = new Set(nonEmpty.map(String)).size;
    const uniqueRatio = nonEmpty.length > 0 ? uniqueCount / nonEmpty.length : 1;
    const role = detectRole(detectedType, col, nonEmpty.length / values.length, uniqueRatio);

    return {
      name: col,
      detectedType,
      role,
      nullable: nonEmpty.length < values.length,
      uniqueCount,
      totalCount: values.length,
      emptyCount: values.length - nonEmpty.length,
      sampleValues: nonEmpty.slice(0, 5).map(String),
    };
  });

  const metadata: DatasetMetadata = {
    id: generateId(),
    filename,
    rowCount: rows.length,
    columnCount: columns.length,
    columns: columnMetadata,
    detectedAt: new Date().toISOString(),
  };

  return { columns, rows, metadata };
}

function inferColumnType(values: unknown[]): ColumnType {
  const sample = values.filter((v) => v !== null && v !== undefined && v !== "").slice(0, 100);
  if (sample.length === 0) return "text";

  const numericCount = sample.filter((v) => typeof v === "number" || !isNaN(Number(v))).length;
  if (numericCount / sample.length > 0.8) {
    const numValues = sample.map(Number).filter((n) => !isNaN(n));
    const hasDecimals = numValues.some((n) => n !== Math.floor(n));
    return hasDecimals ? "decimal" : "integer";
  }

  const dateCount = sample.filter((v) => {
    const str = String(v);
    return !isNaN(Date.parse(str)) && /\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(str);
  }).length;
  if (dateCount / sample.length > 0.8) return "date";

  const boolCount = sample.filter((v) => {
    const str = String(v).toLowerCase();
    return ["true", "false", "yes", "no", "1", "0"].includes(str);
  }).length;
  if (boolCount / sample.length > 0.8) return "boolean";

  const strValues = sample.map(String);
  const uniqueRatio = new Set(strValues).size / strValues.length;
  if (uniqueRatio < 0.05) return "text";

  const idLike = strValues.every((v) => /^\d+$/.test(v) || /^[A-Z]{2,3}-\d+/.test(v));
  if (idLike && uniqueRatio > 0.8) return "id";

  return "text";
}

function wordMatches(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase().replace(/[_\-\s]+/g, " ").trim();
  const words = lower.split(/\s+/);
  return keywords.some((kw) => words.some((w) => w === kw || w.startsWith(kw)));
}

function detectRole(
  type: ColumnType,
  name: string,
  fillRate: number,
  uniqueRatio: number
): ColumnRole {
  if (type === "date") return "dimension";
  if (type === "boolean") return "dimension";
  if (type === "id") return "dimension";

  if (type === "integer" || type === "decimal") {
    const lower = name.toLowerCase();
    const dimensionKeywords = ["id", "code", "zip", "postal", "year", "month", "day", "quarter"];
    if (dimensionKeywords.some((kw) => lower === kw || lower.endsWith(` ${kw}`) || lower.startsWith(`${kw} `))) {
      return "dimension";
    }
    return "measure";
  }

  if (type === "text" || type === "percentage") {
    if (uniqueRatio <= 0.05) return "dimension";

    const lower = name.toLowerCase();
    const measureKeywords = ["amount", "revenue", "profit", "sales", "cost", "price", "total", "sum", "value", "quantity", "rate", "score", "margin"];
    if (wordMatches(name, measureKeywords)) return "measure";

    const dimensionKeywords = ["name", "category", "region", "country", "city", "state", "type", "status", "segment", "group", "department", "class", "level", "id", "code"];
    if (wordMatches(name, dimensionKeywords)) return "dimension";

    if (fillRate < 0.5) return "dimension";
  }

  return "dimension";
}
