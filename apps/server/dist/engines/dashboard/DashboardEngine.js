import { randomUUID } from "node:crypto";
import { KPIWidgetBuilder } from "./KPIWidgetBuilder.js";
import { ChartRecommendationEngine } from "./ChartRecommendationEngine.js";
import { FilterBuilder } from "./FilterBuilder.js";
import { LayoutBuilder } from "./LayoutBuilder.js";
export class DashboardEngine {
    kpis = new KPIWidgetBuilder();
    charts = new ChartRecommendationEngine();
    filters = new FilterBuilder();
    layout = new LayoutBuilder();
    execute(input) {
        const widgets = [
            ...this.kpis.execute(input.statistics.kpis),
            ...this.charts.execute(input.metadata),
        ];
        const layout = this.layout.execute(widgets);
        const filters = this.filters.execute(input.metadata);
        return {
            id: randomUUID(),
            title: "AI Generated Dashboard",
            description: "Automatically generated dashboard",
            widgets,
            filters,
            layout,
        };
    }
}
//# sourceMappingURL=DashboardEngine.js.map