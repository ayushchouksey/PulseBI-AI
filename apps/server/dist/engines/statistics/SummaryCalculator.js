export class SummaryCalculator {
    execute(context) {
        const profile = context.profile;
        let missingValues = 0;
        context.dataset.rows.forEach(row => {
            Object.values(row).forEach(value => {
                if (value === null ||
                    value === undefined ||
                    value === "") {
                    missingValues++;
                }
            });
        });
        context.summary = {
            totalRows: profile.rowCount,
            totalColumns: profile.columnCount,
            numericColumns: profile.numericColumns.length,
            categoryColumns: profile.categoryColumns.length,
            dateColumns: profile.dateColumns.length,
            missingValues,
            duplicateRows: 0,
        };
        return context;
    }
}
//# sourceMappingURL=SummaryCalculator.js.map