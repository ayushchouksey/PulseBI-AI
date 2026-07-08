import type { DataQualityReport, Dataset } from "@pulsebi/shared-types";
import type { Engine } from "../../core/engine.interface.js";
export declare class DataQualityEngine implements Engine<Dataset, DataQualityReport> {
    private readonly headerValidator;
    private readonly rowValidator;
    private readonly missingAnalyzer;
    private readonly duplicateAnalyzer;
    private readonly columnAnalyzer;
    private readonly scoreCalculator;
    execute(dataset: Dataset): DataQualityReport;
}
