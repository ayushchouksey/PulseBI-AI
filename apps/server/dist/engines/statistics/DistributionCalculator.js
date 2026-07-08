export class DistributionCalculator {
    execute(context) {
        const category = context.metadata.find(column => column.businessRole === "category");
        if (!category) {
            context.distributions = [];
            return context;
        }
        const grouped = new Map();
        context.dataset.rows.forEach(row => {
            const value = String(row[category.originalName] ?? "Unknown");
            grouped.set(value, (grouped.get(value) ?? 0) + 1);
        });
        const distribution = {
            name: category.displayName,
            labels: [...grouped.keys()],
            values: [...grouped.values()],
        };
        context.distributions = [distribution];
        return context;
    }
}
//# sourceMappingURL=DistributionCalculator.js.map