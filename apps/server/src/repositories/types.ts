import type {
    ColumnMetadata,
    DataQualityReport,
    Dataset,
    DatasetStatistics,
  } from "@pulsebi/shared-types";
  
  /**
   * Complete uploaded dataset stored in memory.
   */
  export interface StoredDataset {
  
    dataset: Dataset;
  
    metadata: ColumnMetadata[];
  
    quality: DataQualityReport;
  
    statistics: DatasetStatistics;
  
    uploadedAt: Date;
  
  }