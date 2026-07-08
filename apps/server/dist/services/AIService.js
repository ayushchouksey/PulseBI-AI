import { NLPEngine } from "../engines/nlp/NLPEngine.js";
import { OllamaProvider } from "../providers/ollama.provider.js";
export class AIService {
    engine = new NLPEngine();
    provider = new OllamaProvider();
    async askQuestion(question) {
        await this.engine.process(question);
        const answer = await this.provider.answerQuestion(question, {});
        return {
            answer,
            actions: []
        };
    }
}
//# sourceMappingURL=AIService.js.map