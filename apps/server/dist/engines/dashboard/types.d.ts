export interface DashboardDefinition {
    id: string;
    title: string;
    description: string;
    layout: DashboardLayout;
    filters: DashboardFilter[];
    widgets: DashboardWidget[];
}
export interface DashboardWidget {
    id: string;
    title: string;
    type: "kpi" | "bar" | "line" | "pie" | "table";
    position: WidgetPosition;
    config: WidgetConfig;
}
export interface WidgetPosition {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface WidgetConfig {
    xAxis?: string;
    yAxis?: string;
    aggregation?: string;
}
export interface DashboardFilter {
    field: string;
    type: "select" | "date";
}
export interface DashboardLayout {
    columns: number;
    rowHeight: number;
}
