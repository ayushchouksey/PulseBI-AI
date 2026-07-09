export class KPIWidgetBuilder {
    execute(kpis) {
        return kpis.map((kpi, index) => ({
            id: `kpi-${kpi.name.toLowerCase().replace(/\s+/g, "-")}`,
            title: kpi.name,
            type: "kpi",
            position: {
                x: index * 3,
                y: 0,
                w: 3,
                h: 2,
            },
            config: {
                aggregation: kpi.aggregation,
            },
        }));
    }
}
//# sourceMappingURL=KPIWidgetBuilder.js.map