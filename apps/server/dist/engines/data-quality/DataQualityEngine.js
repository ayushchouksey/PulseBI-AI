import { HeaderValidator } from "./HeaderValidator.js";
import { RowValidator } from "./RowValidator.js";
import { MissingValueAnalyzer } from "./MissingValueAnalyzer.js";
import { DuplicateAnalyzer } from "./DuplicateAnalyzer.js";
import { ColumnAnalyzer } from "./ColumnAnalyzer.js";
import { QualityScoreCalculator } from "./QualityScoreCalculator.js";
export class DataQualityEngine {
    headerValidator = new HeaderValidator();
    rowValidator = new RowValidator();
    missingAnalyzer = new MissingValueAnalyzer();
    duplicateAnalyzer = new DuplicateAnalyzer();
    columnAnalyzer = new ColumnAnalyzer();
    scoreCalculator = new QualityScoreCalculator();
    execute(dataset) {
        const headerIssues = this.headerValidator.execute(dataset);
        const rowResult = this.rowValidator.execute(dataset);
        let columns = this.missingAnalyzer.execute(dataset);
        columns =
            this.columnAnalyzer.execute(dataset, columns);
        const duplicateRows = this.duplicateAnalyzer.execute(dataset);
        const issues = [
            ...headerIssues,
            ...rowResult.issues,
        ];
        const score = this.scoreCalculator.execute(columns, duplicateRows, issues);
        return {
            score,
            totalRows: dataset.totalRows,
            totalColumns: dataset.totalColumns,
            duplicateRows,
            emptyRows: rowResult.emptyRows,
            columns,
            issues,
        };
    }
}
//# sourceMappingURL=DataQualityEngine.js.map