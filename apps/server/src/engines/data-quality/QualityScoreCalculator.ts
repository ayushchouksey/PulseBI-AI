import type {
  ColumnQuality,
  QualityIssue,
} from "@pulsebi/shared-types";

export class QualityScoreCalculator {

  public execute(
    columns: ColumnQuality[],
    duplicateRows: number,
    issues: QualityIssue[]
  ): number {

    let score = 100;

    score -= duplicateRows * 0.2;

    columns.forEach(column => {

      score -= column.missingPercentage * 0.1;

      if (column.isConstant) {
        score -= 5;
      }

      if (column.isHighCardinality) {
        score -= 2;
      }

    });

    issues.forEach(issue => {
      score -= issue.severity === "error"
        ? 10
        : 3;
    });

    score = Math.max(0, Math.min(100, score));

    return Math.round(score);

  }

}