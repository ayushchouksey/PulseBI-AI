import { NLPEngine } from "../engines/nlp/NLPEngine.js";
import { OllamaProvider } from "../providers/ollama.provider.js";

export class AIService {

  private engine = new NLPEngine();

  private provider = new OllamaProvider();

  public async askQuestion(
    question: string
  ) {

    await this.engine.process(question);

    const answer =
      await this.provider.answerQuestion(
        question,
        {} as any
      );

    return {

      answer,

      actions: []

    };

  }

}