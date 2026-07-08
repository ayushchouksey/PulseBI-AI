export interface Calculator<TContext> {
    execute(context: TContext): TContext;
  }