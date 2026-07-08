import { FileValidator } from "./FileValidator.js";
import { DelimiterDetector } from "./DelimiterDetector.js";
import { CsvParser } from "./CsvParser.js";
import { DatasetNormalizer } from "./DatasetNormalizer.js";
import type { Engine } from "../../core/engine.interface.js";
import type { Dataset } from "./types.js";
export declare class DataIngestionEngine implements Engine<Express.Multer.File, Dataset> {
    private readonly validator;
    private readonly delimiterDetector;
    private readonly parser;
    private readonly normalizer;
    constructor(validator?: FileValidator, delimiterDetector?: DelimiterDetector, parser?: CsvParser, normalizer?: DatasetNormalizer);
    execute(file: Express.Multer.File): Promise<Dataset>;
}
