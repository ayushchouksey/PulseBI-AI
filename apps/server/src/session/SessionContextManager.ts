import type { DatasetContext } from "@pulsebi/shared-types";

export class SessionContextManager {
  private readonly sessions = new Map<string, DatasetContext>();

  create(context: DatasetContext): void {
    this.sessions.set(context.dataset.id, context);
  }

  get(datasetId: string): DatasetContext | undefined {
    return this.sessions.get(datasetId);
  }

  update(datasetId: string, context: DatasetContext): void {
    this.sessions.set(datasetId, context);
  }

  delete(datasetId: string): void {
    this.sessions.delete(datasetId);
  }

  clear(): void {
    this.sessions.clear();
  }
}