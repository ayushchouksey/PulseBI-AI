import type {
    Dataset,
    ColumnMetadata,
    DatasetStatistics,
    DataQualityReport,
} from "@pulsebi/shared-types";

import type {
    Engine,
} from "../../core/engine.interface.js";

import { AggregationCalculator } from "./AggregationCalculator.js";
import { DatasetProfiler } from "./DatasetProfiler.js";
import { DistributionCalculator } from "./DistributionCalculator.js";
import { KPICalculator } from "./KPICalculator.js";
import { RankingCalculator } from "./RankingCalculator.js";
import { SummaryCalculator } from "./SummaryCalculator.js";
import { TrendCalculator } from "./TrendCalculator.js";
import type { StatisticsContext } from "./types.js";

export class StatisticsEngine
    implements Engine<
        { dataset: Dataset; metadata: ColumnMetadata[] },
        DatasetStatistics
    > {
    private readonly profiler = new DatasetProfiler();
    private readonly summary = new SummaryCalculator();
    private readonly aggregation = new AggregationCalculator();
    private readonly trends = new TrendCalculator();
    private readonly rankings = new RankingCalculator();
    private readonly distributions = new DistributionCalculator();
    private readonly kpis = new KPICalculator();

    execute(input: {
        dataset: Dataset;
        metadata: ColumnMetadata[];
        quality: DataQualityReport;
    }): DatasetStatistics {

        let context: StatisticsContext = {
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

            summary: context.summary!,

            columnStatistics: [],

            kpis: context.kpis ?? [],

            trends: context.trends ?? [],

            rankings: context.rankings ?? [],

            distributions: context.distributions ?? [],

        };
    }
}