import type {
    ErrorModel
  } from "@pulsebi/shared-types";
  
  
  export class AppError extends Error {
  
    public readonly statusCode: number;
  
    public readonly code: string;
  
    public readonly errors?: ErrorModel[] | string[];;
  
  
    constructor(
      message: string,
      statusCode = 500,
      errors?: ErrorModel[] | string[],
      code = "INTERNAL_ERROR"
    ) {
  
      super(message);
  
      this.name = "AppError";
  
      this.statusCode = statusCode;
  
      this.code = code;
  
      this.errors = errors;
  
  
      Object.setPrototypeOf(
        this,
        AppError.prototype
      );
    }
  
  }