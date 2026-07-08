import { AggregationCalculator } from "./AggregationCalculator.js";
import { DatasetProfiler } from "./DatasetProfiler.js";
import { DistributionCalculator } from "./DistributionCalculator.js";
import { KPICalculator } from "./KPICalculator.js";
import { RankingCalculator } from "./RankingCalculator.js";
import { SummaryCalculator } from "./SummaryCalculator.js";
import { TrendCalculator } from "./TrendCalculator.js";
export class StatisticsEngine {
    profiler = new DatasetProfiler();
    summary = new SummaryCalculator();
    aggregation = new AggregationCalculator();
    trends = new TrendCalculator();
    rankings = new RankingCalculator();
    distributions = new DistributionCalculator();
    kpis = new KPICalculator();
    execute(input) {
        let context = {
            dataset: input.dataset,
            metadata: input.metadata,
            quality: input.quality,
        };
        context = this.profiler.execute(context);
        context = this.summary.execute(context);
        context = this.aggregation.execute(context);
        context = this.trends.execute(context);
        context = this.rankings.execute(context);
        context = this.distributions.execute(context);
        context = this.kpis.execute(context);
        return {
            rowCount: context.dataset.totalRows,
            columnCount: context.dataset.totalColumns,
            summary: context.summary,
            columnStatistics: [],
            kpis: context.kpis ?? [],
            trends: context.trends ?? [],
            rankings: context.rankings ?? [],
            distributions: context.distributions ?? [],
        };
    }
}
//# sourceMappingURL=StatisticsEngine.js.map