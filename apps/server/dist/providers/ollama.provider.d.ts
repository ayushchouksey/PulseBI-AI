import { AIProvider } from './provider.interface.js';
import { AIResponse, ConversationContext } from '@pulsebi/shared-types';
export declare class OllamaProvider implements AIProvider {
    generateSummary(_statisticsContext: Record<string, any>): Promise<string>;
    answerQuestion(question: string, _context: ConversationContext): Promise<string>;
    generateDashboardAction(question: string, _context: ConversationContext): Promise<AIResponse>;
    generateRecommendations(_statisticsContext: Record<string, any>): Promise<string[]>;
}
