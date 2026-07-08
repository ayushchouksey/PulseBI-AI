export interface Provider<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
  }