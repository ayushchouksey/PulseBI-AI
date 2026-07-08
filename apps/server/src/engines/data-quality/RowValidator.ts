import type {
  Dataset,
  QualityIssue,
} from "@pulsebi/shared-types";

export class RowValidator {

  public execute(
    dataset: Dataset
  ): {
    issues: QualityIssue[];
    emptyRows: number;
  } {

    const issues: QualityIssue[] = [];

    let emptyRows = 0;

    dataset.rows.forEach((row, index) => {

      const values = Object.values(row);

      const isEmpty = values.every(value => {

        if (value === null || value === undefined) {
          return true;
        }

        if (typeof value === "string") {
          return value.trim() === "";
        }

        return false;

      });

      if (isEmpty) {

        emptyRows++;

        issues.push({
          severity: "warning",
          code: "DQ003",
          message: `Row ${index + 1} is empty.`,
        });

      }

      if (values.length !== dataset.totalColumns) {

        issues.push({
          severity: "error",
          code: "DQ004",
          message: `Row ${index + 1} has an invalid column count.`,
        });

      }

    });

    return {
      issues,
      emptyRows,
    };

  }

}