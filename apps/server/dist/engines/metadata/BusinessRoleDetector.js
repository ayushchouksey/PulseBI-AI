export class BusinessRoleDetector {
    execute(columnName, type) {
        const name = columnName.toLowerCase();
        if (name.includes("date") ||
            type === "date") {
            return "date";
        }
        if (name.includes("id") ||
            name.includes("code")) {
            return "identifier";
        }
        if (type === "number") {
            return "metric";
        }
        return "category";
    }
}
//# sourceMappingURL=BusinessRoleDetector.js.map