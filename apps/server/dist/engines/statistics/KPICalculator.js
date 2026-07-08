export class KPICalculator {
    execute(context) {
        const kpis = [];
        const metricColumns = context.metadata.filter(column => column.businessRole === "metric");
        for (const column of metricColumns) {
            const values = context.dataset.rows
                .map(row => Number(row[column.originalName]))
                .filter(value => !Number.isNaN(value));
            const total = values.reduce((sum, value) => sum + value, 0);
            kpis.push({
                name: column.displayName,
                value: total,
                aggregation: column.aggregation,
                format: "number",
            });
        }
        context.kpis = kpis;
        return context;
    }
}
//# sourceMappingURL=KPICalculator.js.map