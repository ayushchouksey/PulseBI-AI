import type {
  Dataset,
} from "@pulsebi/shared-types";

export class DuplicateAnalyzer {

  public execute(
    dataset: Dataset
  ): number {

    const seen = new Set<string>();

    let duplicates = 0;

    for (const row of dataset.rows) {

      const key = JSON.stringify(row);

      if (seen.has(key)) {
        duplicates++;
      } else {
        seen.add(key);
      }

    }

    return duplicates;

  }

}