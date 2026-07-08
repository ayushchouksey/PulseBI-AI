export class TrendCalculator {
    execute(context) {
        const dateColumn = context.metadata.find(column => column.businessRole === "date");
        const metricColumn = context.metadata.find(column => column.businessRole === "metric");
        if (!dateColumn || !metricColumn) {
            context.trends = [];
            return context;
        }
        const grouped = new Map();
        for (const row of context.dataset.rows) {
            const date = row[dateColumn.originalName];
            const value = row[metricColumn.originalName];
            if (!(date instanceof Date) ||
                typeof value !== "number") {
                continue;
            }
            const key = date.toISOString().split("T")[0];
            grouped.set(key, (grouped.get(key) ?? 0) + value);
        }
        const trend = {
            name: `${metricColumn.displayName} Trend`,
            x: [...grouped.keys()],
            y: [...grouped.values()],
        };
        context.trends = [trend];
        return context;
    }
}
//# sourceMappingURL=TrendCalculator.js.map