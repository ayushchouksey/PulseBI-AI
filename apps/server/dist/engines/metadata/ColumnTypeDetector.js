export class ColumnTypeDetector {
    execute(values) {
        const filtered = values.filter(value => value !== null);
        if (filtered.length === 0) {
            return "text";
        }
        if (filtered.every(value => typeof value === "number")) {
            return "number";
        }
        if (filtered.every(value => typeof value === "boolean")) {
            return "boolean";
        }
        if (filtered.every(value => value instanceof Date)) {
            return "date";
        }
        return "text";
    }
}
//# sourceMappingURL=ColumnTypeDetector.js.map