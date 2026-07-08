import type { DatasetMetadata } from "@pulsebi/shared-types";
export interface UploadResponseModel {
    datasetId: string;
    metadata?: DatasetMetadata;
}
