import type {
  Dataset,
  ColumnMetadata,
  DatasetStatistics,
} from "@pulsebi/shared-types";

import type {
  Engine,
} from "../../core/engine.interface.js";

import type {
  DashboardDefinition,
} from "./types.js";

import { KPIWidgetBuilder } from "./KPIWidgetBuilder.js";

import { ChartRecommendationEngine } from "./ChartRecommendationEngine.js";


export class DashboardEngine
  implements Engine<
    {
      dataset: Dataset;
      metadata: ColumnMetadata[];
      statistics: DatasetStatistics;
    },
    DashboardDefinition
  >
{

  private readonly kpiBuilder =
    new KPIWidgetBuilder();


  private readonly chartEngine =
    new ChartRecommendationEngine();


  execute(input: {

    dataset: Dataset;

    metadata: ColumnMetadata[];

    statistics: DatasetStatistics;

  }): DashboardDefinition {


    const kpiWidgets =
      this.kpiBuilder.execute(
        input.statistics.kpis
      );


    const chartWidgets =
      this.chartEngine.execute(
        input.metadata
      );


    return {

      id:
        `dashboard-${input.dataset.id}`,

      title:
        `${input.dataset.fileName} Dashboard`,

      description:
        "Automatically generated analytics dashboard",

      widgets: [

        ...kpiWidgets,

        ...chartWidgets,

      ],

    };

  }

}