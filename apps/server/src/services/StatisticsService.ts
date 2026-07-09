import { DatasetRepository } from "../repositories/index.js";

export class StatisticsService {

  private readonly repository =
    DatasetRepository.getInstance();

  public async getStatistics(
    datasetId: string
  ) {

    const stored =
      this.repository.findById(datasetId);

    if (!stored) {
      throw new Error(
        "Dataset not found."
      );
    }

    return stored.statistics;

  }

}