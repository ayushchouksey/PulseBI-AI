import { config } from "../config/index.js";

export class ConfigService {

  static async getPublicConfig() {

    return {

      maxUploadSize:
        config.upload.maxFileSize,

      maxRows:
        config.upload.maxRows,

      maxColumns:
        config.upload.maxColumns,

      ollamaModel:
        config.ai.ollamaModel,
        supportedFileTypes: [".csv"],
        supportedCharts: [
          "bar",
          "line",
          "pie",
          "scatter",
          "area",
          "table"
        ]

    };

  }

}