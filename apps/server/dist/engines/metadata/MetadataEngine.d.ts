import type { ColumnMetadata, Dataset } from "@pulsebi/shared-types";
import type { Engine } from "../../core/engine.interface.js";
export declare class MetadataEngine implements Engine<Dataset, ColumnMetadata[]> {
    private readonly typeDetector;
    private readonly roleDetector;
    private readonly displayGenerator;
    private readonly aggregationDetector;
    execute(dataset: Dataset): ColumnMetadata[];
}
