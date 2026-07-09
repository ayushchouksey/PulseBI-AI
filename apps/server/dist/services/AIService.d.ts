export declare class AIService {
    private readonly repository;
    private readonly engine;
    ask(datasetId: string, question: string): Promise<import("../engines/nlp/NLPEngine.js").NLPResponse>;
}
