import * as aq from "arquero";

import type { Calculator } from "../../core/calculator.interface.js";

import type {
  StatisticsContext,
} from "./types.js";

export class AggregationCalculator
  implements Calculator<StatisticsContext>
{
  execute(
    context: StatisticsContext
  ): StatisticsContext {

    // Placeholder for future grouped aggregations.
    // Example:
    //
    // Revenue by Region
    // Profit by Country
    // Sales by Product

    // This calculator will later populate
    // context.rankings
    // context.trends
    // context.distributions

    const table = aq.from(context.dataset.rows);

    // Keep the table available for future calculators if needed.
    void table;

    return context;
  }
}