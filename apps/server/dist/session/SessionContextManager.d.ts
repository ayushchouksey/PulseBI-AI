import type { DatasetContext } from "@pulsebi/shared-types";
export declare class SessionContextManager {
    private readonly sessions;
    create(context: DatasetContext): void;
    get(datasetId: string): DatasetContext | undefined;
    update(datasetId: string, context: DatasetContext): void;
    delete(datasetId: string): void;
    clear(): void;
}
