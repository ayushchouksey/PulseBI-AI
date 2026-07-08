import type { RawDataset } from "./types.js";
export declare class CsvParser {
    parse(buffer: Buffer, delimiter: string): RawDataset;
}
