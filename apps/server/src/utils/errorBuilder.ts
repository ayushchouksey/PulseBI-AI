import type {
    ErrorModel
  } from "@pulsebi/shared-types";
  
  import {
    AppError
  } from "./AppError.js";
  
  
  export function buildErrorResponse(
    error: unknown
  ): {
    statusCode:number;
    errors:ErrorModel[];
  } {
  
  
    if(error instanceof AppError){
  
      return {
  
        statusCode:
          error.statusCode,
  
        errors:
        [
          {
            code:
              error.code,
  
            message:
              error.message
          }
        ]
  
      };
  
    }
  
  
    return {
  
      statusCode:500,
  
      errors:
      [
        {
          code:
            "INTERNAL_ERROR",
  
          message:
            "Something went wrong"
        }
      ]
  
    };
  
  }