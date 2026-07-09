export class FilterBuilder {
    execute(metadata) {
        const filters = [];
        metadata.forEach(column => {
            if (column.businessRole === "category") {
                filters.push({
                    field: column.originalName,
                    type: "select",
                });
            }
            if (column.businessRole === "date") {
                filters.push({
                    field: column.originalName,
                    type: "date",
                });
            }
        });
        return filters;
    }
}
//# sourceMappingURL=FilterBuilder.js.map