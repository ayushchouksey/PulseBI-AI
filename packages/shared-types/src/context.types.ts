import type { Dataset } from "./dataset.types.js";
import type { DashboardModel } from "./dashboard.types.js";
import type { MetadataResponse } from "./metadata.types.js";
import type { DatasetStatistics } from "./statistics.types.js";
import type { AIContext } from "./ai.types.js";

export interface DatasetContext {
  dataset: Dataset;

  quality?: unknown;

  metadata?: MetadataResponse;

  statistics?: DatasetStatistics;

  dashboard?: DashboardModel;

  filters: Record<string, unknown>;

  aiContext?: AIContext;

  createdAt: Date;

  updatedAt: Date;
}