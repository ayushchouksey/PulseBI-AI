export interface DashboardDefinition {
    id: string;
    title: string;
    description: string;
    widgets: DashboardWidget[];
}
export interface DashboardWidget {
    id: string;
    title: string;
    type: "kpi" | "bar" | "line" | "pie" | "table";
    config: WidgetConfig;
}
export interface WidgetConfig {
    xAxis?: string;
    yAxis?: string;
    aggregation?: string;
}
