import type {
  Dataset,
  ColumnMetadata,
  DatasetStatistics,
} from "@pulsebi/shared-types";

import type {
  Engine,
} from "../../core/engine.interface.js";

export interface NLPInput {

  dataset: Dataset;

  metadata: ColumnMetadata[];

  statistics: DatasetStatistics;

  question: string;

}

export interface NLPResponse {

  intent: string;

  answer: string;

  widget?: string;

}

export class NLPEngine
  implements Engine<NLPInput, NLPResponse>
{

  execute(
    input: NLPInput
  ): NLPResponse {

    const question =
      input.question.toLowerCase();

    if (
      question.includes("revenue") &&
      question.includes("category")
    ) {

      return {

        intent: "category-analysis",

        widget: "bar",

        answer:
          "Showing Revenue grouped by Category.",

      };

    }

    if (
      question.includes("trend") ||
      question.includes("monthly")
    ) {

      return {

        intent: "trend",

        widget: "line",

        answer:
          "Showing monthly trend.",

      };

    }

    if (
      question.includes("top")
    ) {

      return {

        intent: "ranking",

        widget: "table",

        answer:
          "Showing top ranked values.",

      };

    }

    return {

      intent: "general",

      answer:
        `Dataset contains ${input.dataset.totalRows} rows and ${input.dataset.totalColumns} columns.`,

    };

  }

}