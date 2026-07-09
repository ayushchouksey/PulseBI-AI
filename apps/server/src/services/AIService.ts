import { DatasetRepository } from "../repositories/index.js";

import { NLPEngine } from "../engines/nlp/index.js";

export class AIService {

  private readonly repository =
    DatasetRepository.getInstance();

  private readonly engine =
    new NLPEngine();

  public async ask(
    datasetId: string,
    question: string
  ) {

    const stored =
      this.repository.findById(datasetId);

    if (!stored) {
      throw new Error("Dataset not found.");
    }

    return this.engine.execute({

      dataset: stored.dataset,

      metadata: stored.metadata,

      statistics: stored.statistics,

      question,

    });

  }

}