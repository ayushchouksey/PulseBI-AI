import type { Dataset, RawDataset } from "./types.js";
export declare class DatasetNormalizer {
    normalize(rawDataset: RawDataset, fileName: string, delimiter: string): Dataset;
    private convertValue;
}
