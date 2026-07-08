import { AppError } from "../../utils/AppError.js";
import { FileValidator } from "./FileValidator.js";
import { DelimiterDetector } from "./DelimiterDetector.js";
import { CsvParser } from "./CsvParser.js";
import { DatasetNormalizer } from "./DatasetNormalizer.js";
export class DataIngestionEngine {
    validator;
    delimiterDetector;
    parser;
    normalizer;
    constructor(validator = new FileValidator(), delimiterDetector = new DelimiterDetector(), parser = new CsvParser(), normalizer = new DatasetNormalizer()) {
        this.validator = validator;
        this.delimiterDetector = delimiterDetector;
        this.parser = parser;
        this.normalizer = normalizer;
    }
    async execute(file) {
        const validation = this.validator.validate(file);
        if (!validation.valid) {
            throw new AppError("UPLOAD_VALIDATION_FAILED", 400, validation.errors);
        }
        const delimiter = this.delimiterDetector.detect(file.buffer);
        const rawDataset = this.parser.parse(file.buffer, delimiter);
        const dataset = this.normalizer.normalize(rawDataset, file.originalname, delimiter);
        return dataset;
    }
}
//# sourceMappingURL=DataIngestionEngine.js.map