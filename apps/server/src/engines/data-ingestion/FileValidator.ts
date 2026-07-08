import path from "node:path";

import { config } from "../../config/index.js";

import type { ValidationResult } from "./types.js";

export class FileValidator {

  validate(file: Express.Multer.File): ValidationResult {

    const errors: string[] = [];

    const warnings: string[] = [];

    if (!file) {
      errors.push("No file uploaded.");
    }

    if (!file.originalname.toLowerCase().endsWith(".csv")) {
      errors.push("Only CSV files are supported.");
    }

    if (file.size === 0) {
      errors.push("Uploaded file is empty.");
    }

    if (file.size > config.upload.maxFileSize) {
      errors.push(
        `Maximum upload size is ${config.upload.maxFileSize} bytes.`
      );
    }

    const extension = path.extname(file.originalname);

    if (extension.toLowerCase() !== ".csv") {
      warnings.push("Unexpected file extension.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

}