import type {
    ColumnMetadata,
    DataQualityReport,
    Dataset,
    DatasetSummary,
    Distribution,
    KPI,
    Ranking,
    Trend,
} from "@pulsebi/shared-types";

export interface DatasetProfile {
    rowCount: number;
    columnCount: number;

    numericColumns: string[];
    categoryColumns: string[];
    dateColumns: string[];
    metricColumns: string[];
}

export interface StatisticsContext {
    dataset: Dataset;

    metadata: ColumnMetadata[];

    quality: DataQualityReport;

    profile?: DatasetProfile;

    summary?: DatasetSummary;

    kpis?: KPI[];

    trends?: Trend[];

    rankings?: Ranking[];

    distributions?: Distribution[];
}