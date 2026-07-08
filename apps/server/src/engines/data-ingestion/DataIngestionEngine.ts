
import { AppError } from "../../utils/AppError.js";

import { FileValidator } from "./FileValidator.js";
import { DelimiterDetector } from "./DelimiterDetector.js";
import { CsvParser } from "./CsvParser.js";
import { DatasetNormalizer } from "./DatasetNormalizer.js";

import type { Engine } from "../../core/engine.interface.js";


import type { Dataset } from "./types.js";

export class DataIngestionEngine implements Engine<Express.Multer.File, Dataset> {

  constructor(
    private readonly validator = new FileValidator(),
    private readonly delimiterDetector = new DelimiterDetector(),
    private readonly parser = new CsvParser(),
    private readonly normalizer = new DatasetNormalizer()
  ) {}

  public async execute(
    file: Express.Multer.File
  ): Promise<Dataset> {

    const validation = this.validator.validate(file);

    if (!validation.valid) {
      throw new AppError(
        "UPLOAD_VALIDATION_FAILED",
        400,
        validation.errors
      );
    }

    const delimiter =
      this.delimiterDetector.detect(file.buffer);

    const rawDataset =
      this.parser.parse(
        file.buffer,
        delimiter
      );

    const dataset =
      this.normalizer.normalize(
        rawDataset,
        file.originalname,
        delimiter
      );

    return dataset;
  }

}