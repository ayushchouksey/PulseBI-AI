export interface AIQueryRequestModel {
    datasetId: string;
    question: string;
    conversationId?: string;
    dashboardContext?: Record<string, unknown>;
}
