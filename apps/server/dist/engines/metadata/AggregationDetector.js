export class AggregationDetector {
    execute(columnName, columnType, businessRole) {
        const name = columnName.toLowerCase();
        if (businessRole === "identifier") {
            return "none";
        }
        if (businessRole === "date") {
            return "none";
        }
        if (columnType !== "number") {
            return "none";
        }
        if (name.includes("price") ||
            name.includes("amount") ||
            name.includes("revenue") ||
            name.includes("sales") ||
            name.includes("profit") ||
            name.includes("cost") ||
            name.includes("income") ||
            name.includes("expense")) {
            return "sum";
        }
        if (name.includes("rating") ||
            name.includes("score") ||
            name.includes("percentage")) {
            return "avg";
        }
        if (name.includes("quantity") ||
            name.includes("count")) {
            return "sum";
        }
        return "sum";
    }
}
//# sourceMappingURL=AggregationDetector.js.map