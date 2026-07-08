import type {
  CellValue,
  ColumnQuality,
  Dataset,
} from "@pulsebi/shared-types";

export class ColumnAnalyzer {

  public execute(
    dataset: Dataset,
    columns: ColumnQuality[]
  ): ColumnQuality[] {

    return columns.map(column => {

      const values = dataset.rows.map(
        row => row[column.columnName]
      );

      const uniqueValues = new Set<CellValue>(values);

      return {

        ...column,

        uniqueValues: uniqueValues.size,

        duplicateValues:
          values.length - uniqueValues.size,

        isConstant:
          uniqueValues.size <= 1,

        isHighCardinality:
          uniqueValues.size > dataset.totalRows * 0.8,

        sampleValues: [...uniqueValues]
          .filter(
            (value): value is Exclude<CellValue, null> =>
              value !== null
          )
          .slice(0, 5)
          .map(value =>
            value instanceof Date
              ? value.toISOString()
              : String(value)
          ),

      };

    });

  }

}