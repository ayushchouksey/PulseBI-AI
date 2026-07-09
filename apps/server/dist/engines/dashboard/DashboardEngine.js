import { KPIWidgetBuilder } from "./KPIWidgetBuilder.js";
import { ChartRecommendationEngine } from "./ChartRecommendationEngine.js";
export class DashboardEngine {
    kpiBuilder = new KPIWidgetBuilder();
    chartEngine = new ChartRecommendationEngine();
    execute(input) {
        const kpiWidgets = this.kpiBuilder.execute(input.statistics.kpis);
        const chartWidgets = this.chartEngine.execute(input.metadata);
        return {
            id: `dashboard-${input.dataset.id}`,
            title: `${input.dataset.fileName} Dashboard`,
            description: "Automatically generated analytics dashboard",
            widgets: [
                ...kpiWidgets,
                ...chartWidgets,
            ],
        };
    }
}
//# sourceMappingURL=DashboardEngine.js.map