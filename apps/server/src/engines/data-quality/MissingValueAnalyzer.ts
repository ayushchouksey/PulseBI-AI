import type {
  ColumnQuality,
  Dataset,
} from "@pulsebi/shared-types";

export class MissingValueAnalyzer {

  public execute(
    dataset: Dataset
  ): ColumnQuality[] {

    return dataset.headers.map(header => {

      const values = dataset.rows.map(
        row => row[header]
      );

      const missingValues = values.filter(value => {

        if (value === null || value === undefined) {
          return true;
        }

        if (typeof value === "string") {
          return value.trim() === "";
        }

        return false;

      }).length;

      return {

        columnName: header,

        missingValues,

        missingPercentage:
          dataset.totalRows === 0
            ? 0
            : (missingValues / dataset.totalRows) * 100,

        uniqueValues: 0,

        duplicateValues: 0,

        isConstant: false,

        isHighCardinality: false,

        sampleValues: [],

      };

    });

  }

}