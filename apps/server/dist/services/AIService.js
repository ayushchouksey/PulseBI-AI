import { DatasetRepository } from "../repositories/index.js";
import { NLPEngine } from "../engines/nlp/index.js";
export class AIService {
    repository = DatasetRepository.getInstance();
    engine = new NLPEngine();
    async ask(datasetId, question) {
        const stored = this.repository.findById(datasetId);
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
//# sourceMappingURL=AIService.js.map