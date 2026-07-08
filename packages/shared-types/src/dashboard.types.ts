export type WidgetType =
    | "kpi"
    | "chart"
    | "table";


export interface DashboardModel {

    dashboardId: string;

    title: string;
    description: string;

    widgets:
    DashboardWidget[];
    datasetId?: string;
    createdAt: string;
    filters?: unknown[];
    layout?: Record<string, unknown>;
    theme?: string;

}


export interface DashboardWidget {

    id: string;

    type:
    WidgetType;

    title: string;

    position: Record<string, unknown>;
    dataSource: string;
    chartType: string;

    exportable: boolean;
    visible: boolean;

    configuration:
    Record<string, unknown>;


}