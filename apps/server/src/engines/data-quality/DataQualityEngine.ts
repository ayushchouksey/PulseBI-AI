import type {
  DataQualityReport,
  Dataset,
} from "@pulsebi/shared-types";

import type {
  Engine,
} from "../../core/engine.interface.js";

import { HeaderValidator } from "./HeaderValidator.js";
import { RowValidator } from "./RowValidator.js";
import { MissingValueAnalyzer } from "./MissingValueAnalyzer.js";
import { DuplicateAnalyzer } from "./DuplicateAnalyzer.js";
import { ColumnAnalyzer } from "./ColumnAnalyzer.js";
import { QualityScoreCalculator } from "./QualityScoreCalculator.js";

export class DataQualityEngine
  implements Engine<Dataset, DataQualityReport> {

  private readonly headerValidator =
    new HeaderValidator();

  private readonly rowValidator =
    new RowValidator();

  private readonly missingAnalyzer =
    new MissingValueAnalyzer();

  private readonly duplicateAnalyzer =
    new DuplicateAnalyzer();

  private readonly columnAnalyzer =
    new ColumnAnalyzer();

  private readonly scoreCalculator =
    new QualityScoreCalculator();

  public execute(
    dataset: Dataset
  ): DataQualityReport {

    const headerIssues =
      this.headerValidator.execute(dataset);

    const rowResult =
      this.rowValidator.execute(dataset);

    let columns =
      this.missingAnalyzer.execute(dataset);

    columns =
      this.columnAnalyzer.execute(
        dataset,
        columns
      );

    const duplicateRows =
      this.duplicateAnalyzer.execute(dataset);

    const issues = [
      ...headerIssues,
      ...rowResult.issues,
    ];

    const score =
      this.scoreCalculator.execute(
        columns,
        duplicateRows,
        issues
      );

    return {

      score,

      totalRows:
        dataset.totalRows,

      totalColumns:
        dataset.totalColumns,

      duplicateRows,

      emptyRows:
        rowResult.emptyRows,

      columns,

      issues,

    };

  }

}