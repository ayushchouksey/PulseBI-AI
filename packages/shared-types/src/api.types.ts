export interface ApiResponse<T> {

    success: boolean;
  
    data?: T;
  
    message?: string;
  
    errors?: ErrorModel[];
  
    requestId: string;
  
    timestamp: string;
  
  }
  
  
  export interface ErrorModel {
  
    code: string;
  
    message: string;
  
    field?: string;
  
  }