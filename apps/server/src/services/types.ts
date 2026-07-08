import type {
    ColumnMetadata,
    DataQualityReport,
    Dataset,
    DatasetStatistics,
  } from "@pulsebi/shared-types";
  
  export interface UploadResponse {
  
    dataset: Dataset;
  
    quality: DataQualityReport;
  
    metadata: ColumnMetadata[];
  
    statistics: DatasetStatistics;
  
  }