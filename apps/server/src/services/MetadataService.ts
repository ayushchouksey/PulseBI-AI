import type {
  ColumnMetadata,
} from "@pulsebi/shared-types";

import { DatasetRepository } from "../repositories/index.js";
import { StatisticsEngine } from "../engines/statistics/index.js";

export class MetadataService {

  private readonly repository =
  DatasetRepository.getInstance();

  private readonly statisticsEngine =
    new StatisticsEngine();

  public async updateMetadata(

    datasetId: string,

    metadata: ColumnMetadata[]

  ) {

    const stored =
      this.repository.findById(datasetId);

    if (!stored) {

      throw new Error("Dataset not found.");

    }

    const statistics =
      this.statisticsEngine.execute({

        dataset: stored.dataset,

        metadata,

        quality: stored.quality,

      });

    const updated =
      this.repository.updateMetadata(

        datasetId,

        metadata,

        statistics

      );

    return updated;

  }

}