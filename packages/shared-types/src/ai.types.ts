export interface ConversationContext {

    datasetId: string;
  
    questionHistory:
      string[];
  
  }
  
  
  export interface AIResponse {
  
    answer: string;
  
    actions:
      DashboardAction[];
  
  }
  
  
  export interface DashboardAction {
  
    type:
      string;
  
    payload:
      Record<string, unknown>;
  
  }

  export interface AIContext {
    conversationId: string;
  
    messages: AIMessage[];
  
    summary?: string;
  }
  
  export interface AIMessage {
    role: "user" | "assistant";
  
    content: string;
  
    timestamp: Date;
  }