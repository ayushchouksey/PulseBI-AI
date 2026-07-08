export class RankingCalculator {
    execute(context) {
        const category = context.metadata.find(column => column.businessRole === "category");
        const metric = context.metadata.find(column => column.businessRole === "metric");
        if (!category || !metric) {
            context.rankings = [];
            return context;
        }
        const grouped = new Map();
        context.dataset.rows.forEach(row => {
            const label = String(row[category.originalName] ?? "Unknown");
            const value = Number(row[metric.originalName] ?? 0);
            grouped.set(label, (grouped.get(label) ?? 0) + value);
        });
        const ranking = {
            name: `${metric.displayName} by ${category.displayName}`,
            labels: [...grouped.keys()],
            values: [...grouped.values()],
        };
        context.rankings = [ranking];
        return context;
    }
}
//# sourceMappingURL=RankingCalculator.js.map