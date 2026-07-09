import { DataIngestionEngine } from "../engines/data-ingestion/index.js";
import { DataQualityEngine } from "../engines/data-quality/index.js";
import { MetadataEngine } from "../engines/metadata/index.js";
import { StatisticsEngine } from "../engines/statistics/index.js";

import { DatasetRepository } from "../repositories/index.js";

import type { UploadResponse } from "./types.js";

export class UploadService {

  private readonly ingestionEngine =
    new DataIngestionEngine();

  private readonly qualityEngine =
    new DataQualityEngine();

  private readonly metadataEngine =
    new MetadataEngine();

  private readonly statisticsEngine =
    new StatisticsEngine();

    private readonly datasetRepository =
    DatasetRepository.getInstance();

  public async processUpload(
    file: Express.Multer.File
  ): Promise<UploadResponse> {

    const dataset =
      await this.ingestionEngine.execute(file);

    const quality =
      this.qualityEngine.execute(dataset);

    const metadata =
      this.metadataEngine.execute(dataset);

    const statistics =
      this.statisticsEngine.execute({

        dataset,

        metadata,

        quality,

      });

    this.datasetRepository.save({

      dataset,

      metadata,

      quality,

      statistics,

    });

    return {

      dataset,

      quality,

      metadata,

      statistics,

    };

  }

}