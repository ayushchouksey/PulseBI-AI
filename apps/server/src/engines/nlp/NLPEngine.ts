import type {
  Dataset,
  ColumnMetadata,
  DatasetStatistics,
} from "@pulsebi/shared-types";

import type {
  Engine,
} from "../../core/engine.interface.js";

export class NLPEngine
  implements Engine<
    {
      dataset: Dataset;
      metadata: ColumnMetadata[];
      statistics: DatasetStatistics;
      question: string;
    },
    unknown
  >
{

  execute(input: {

    dataset: Dataset;

    metadata: ColumnMetadata[];

    statistics: DatasetStatistics;

    question: string;

  }) {

    const question =
      input.question.toLowerCase();

    if (question.includes("kpi")) {

      return {

        type: "kpis",

        answer:
          input.statistics.kpis,

      };

    }

    if (question.includes("column")) {

      return {

        type: "metadata",

        answer:
          input.metadata,

      };

    }

    return {

      type: "summary",

      answer: {

        rows:
          input.dataset.totalRows,

        columns:
          input.dataset.totalColumns,

        kpis:
          input.statistics.kpis.length,

      },

    };

  }

}