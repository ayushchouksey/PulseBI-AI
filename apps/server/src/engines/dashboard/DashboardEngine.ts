import { randomUUID } from "node:crypto";

import type {
  Dataset,
  ColumnMetadata,
  DatasetStatistics,
} from "@pulsebi/shared-types";

import type {
  DashboardDefinition,
} from "./types.js";

import { KPIWidgetBuilder } from "./KPIWidgetBuilder.js";
import { ChartRecommendationEngine } from "./ChartRecommendationEngine.js";
import { FilterBuilder } from "./FilterBuilder.js";
import { LayoutBuilder } from "./LayoutBuilder.js";

import type {
  Engine,
} from "../../core/engine.interface.js";

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

  private readonly kpis =
    new KPIWidgetBuilder();

  private readonly charts =
    new ChartRecommendationEngine();

  private readonly filters =
    new FilterBuilder();

  private readonly layout =
    new LayoutBuilder();

  execute(input: {

    dataset: Dataset;

    metadata: ColumnMetadata[];

    statistics: DatasetStatistics;

  }): DashboardDefinition {

    const widgets = [

      ...this.kpis.execute(
        input.statistics.kpis
      ),
    
      ...this.charts.execute(
        input.metadata
      ),
    
    ];

    const layout =
      this.layout.execute(widgets);

    const filters =
      this.filters.execute(
        input.metadata
      );

    return {

      id: randomUUID(),

      title:
        "AI Generated Dashboard",

      description:
        "Automatically generated dashboard",

      widgets,

      filters,

      layout,

    };

  }

}