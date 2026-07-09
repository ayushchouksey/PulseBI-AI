export class NLPEngine {
    execute(input) {
        const question = input.question.toLowerCase();
        if (question.includes("kpi")) {
            return {
                type: "kpis",
                answer: input.statistics.kpis,
            };
        }
        if (question.includes("column")) {
            return {
                type: "metadata",
                answer: input.metadata,
            };
        }
        return {
            type: "summary",
            answer: {
                rows: input.dataset.totalRows,
                columns: input.dataset.totalColumns,
                kpis: input.statistics.kpis.length,
            },
        };
    }
}
//# sourceMappingURL=NLPEngine.js.map