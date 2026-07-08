export interface UploadRequest {
    filename: string;
}
export interface MetadataRequest {
    datasetId: string;
    metadata: Record<string, unknown>;
}
export interface AIQueryRequest {
    datasetId: string;
    question: string;
    conversationId?: string;
}
export interface DashboardRequest {
    datasetId: string;
}
//# sourceMappingURL=request.types.d.ts.map