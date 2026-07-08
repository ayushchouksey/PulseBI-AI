import { AIResponse, ConversationContext } from '@pulsebi/shared-types';
export interface AIProvider {
    generateSummary(statisticsContext: Record<string, any>): Promise<string>;
    answerQuestion(question: string, context: ConversationContext): Promise<string>;
    generateDashboardAction(question: string, context: ConversationContext): Promise<AIResponse>;
    generateRecommendations(statisticsContext: Record<string, any>): Promise<string[]>;
}
