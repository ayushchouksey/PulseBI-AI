import type {
    DatasetMetadata
  } from "@pulsebi/shared-types";
  
  
  export interface MetadataRequestModel {
  
    datasetId: string;
  
    metadata: DatasetMetadata;
  
  }