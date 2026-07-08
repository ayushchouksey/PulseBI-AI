import type {
  Dataset,
  QualityIssue,
} from "@pulsebi/shared-types";

export class HeaderValidator {

  public execute(
    dataset: Dataset
  ): QualityIssue[] {

    const issues: QualityIssue[] = [];

    const seen = new Set<string>();

    dataset.headers.forEach((header, index) => {

      const value = header.trim();

      if (!value) {

        issues.push({
          severity: "error",
          code: "DQ001",
          message: `Column ${index + 1} has an empty header.`,
        });

        return;

      }

      const normalized = value.toLowerCase();

      if (seen.has(normalized)) {

        issues.push({
          severity: "error",
          code: "DQ002",
          message: `Duplicate header "${value}".`,
        });

      }

      seen.add(normalized);

    });

    return issues;

  }

}