import type {
    ApiResponse
  } from "@pulsebi/shared-types";
  
  
  export function buildSuccessResponse<T>(
    data: T,
    message = "Success",
    requestId = ""
  ): ApiResponse<T> {
  
    return {
        "success": true,
        data,
        message,
        "errors": [],
        requestId,
        "timestamp": ""
      };
  
  }