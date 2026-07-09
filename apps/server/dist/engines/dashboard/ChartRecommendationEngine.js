import { randomUUID } from "node:crypto";
export class ChartRecommendationEngine {
    execute(metadata) {
        const widgets = [];
        const metrics = metadata.filter(column => column.businessRole === "metric");
        const categories = metadata.filter(column => column.businessRole === "category");
        const dates = metadata.filter(column => column.businessRole === "date");
        if (metrics.length && dates.length) {
            widgets.push({
                id: randomUUID(),
                title: `${metrics[0].displayName} Trend`,
                type: "line",
                position: {
                    x: 0,
                    y: 2,
                    w: 12,
                    h: 5,
                },
                config: {
                    xAxis: dates[0].originalName,
                    yAxis: metrics[0].originalName,
                    aggregation: "sum",
                },
            });
        }
        if (metrics.length && categories.length) {
            widgets.push({
                id: randomUUID(),
                title: `${metrics[0].displayName} by ${categories[0].displayName}`,
                type: "bar",
                position: {
                    x: 0,
                    y: 7,
                    w: 6,
                    h: 5,
                },
                config: {
                    xAxis: categories[0].originalName,
                    yAxis: metrics[0].originalName,
                    aggregation: "sum",
                },
            });
        }
        if (categories.length) {
            widgets.push({
                id: randomUUID(),
                title: `${categories[0].displayName} Distribution`,
                type: "pie",
                position: {
                    x: 6,
                    y: 7,
                    w: 6,
                    h: 5,
                },
                config: {
                    xAxis: categories[0].originalName,
                    aggregation: "count",
                },
            });
        }
        return widgets;
    }
}
//# sourceMappingURL=ChartRecommendationEngine.js.map