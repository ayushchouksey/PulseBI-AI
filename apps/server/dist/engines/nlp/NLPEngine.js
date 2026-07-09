export class NLPEngine {
    execute(input) {
        const question = input.question.toLowerCase();
        if (question.includes("revenue") &&
            question.includes("category")) {
            return {
                intent: "category-analysis",
                widget: "bar",
                answer: "Showing Revenue grouped by Category.",
            };
        }
        if (question.includes("trend") ||
            question.includes("monthly")) {
            return {
                intent: "trend",
                widget: "line",
                answer: "Showing monthly trend.",
            };
        }
        if (question.includes("top")) {
            return {
                intent: "ranking",
                widget: "table",
                answer: "Showing top ranked values.",
            };
        }
        return {
            intent: "general",
            answer: `Dataset contains ${input.dataset.totalRows} rows and ${input.dataset.totalColumns} columns.`,
        };
    }
}
//# sourceMappingURL=NLPEngine.js.map