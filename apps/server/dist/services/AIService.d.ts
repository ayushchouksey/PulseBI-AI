export declare class AIService {
    private engine;
    private provider;
    askQuestion(question: string): Promise<{
        answer: string;
        actions: never[];
    }>;
}
