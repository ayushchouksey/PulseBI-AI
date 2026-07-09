export class KPIWidgetBuilder {
    execute(kpis) {
        return kpis.map(kpi => ({
            id: `kpi-${kpi.name.toLowerCase()}`,
            title: kpi.name,
            type: "kpi",
            config: {
                aggregation: kpi.aggregation,
            },
        }));
    }
}
//# sourceMappingURL=KPIWidgetBuilder.js.map