import { DatasetRepository } from "../repositories/index.js";

import { DashboardEngine } from "../engines/dashboard/index.js";
import type { DashboardDefinition } from "../engines/dashboard/types.js";
export class DashboardService {

  private readonly repository =
    DatasetRepository.getInstance();

  private readonly dashboardEngine =
    new DashboardEngine();

  public async generateDashboard(
    datasetId: string
  ) : Promise<DashboardDefinition>  {

    const stored =
      this.repository.findById(datasetId);

    if (!stored) {

      throw new Error(
        "Dataset not found."
      );

    }

    return this.dashboardEngine.execute({

      dataset: stored.dataset,

      metadata: stored.metadata,

      statistics: stored.statistics,

    });

  }

  public async getDashboard(
    datasetId: string
  ) {

    return this.generateDashboard(
      datasetId
    );

  }

  public async regenerateDashboard(
    datasetId: string
  ) {

    return this.generateDashboard(
      datasetId
    );

  }

}