import type {
    DatasetMetadata
  } from "./metadata.types.js";
  
  
  import type {
    DashboardModel
  } from "./dashboard.types.js";
  
  
  import type {
    DatasetStatistics
  } from "./statistics.types.js";
  
  
  export interface UploadResponse {
  
    datasetId: string;
  
    metadata?: DatasetMetadata;
  
  }
  
  
  export interface DashboardResponse {
  
    dashboard:
      DashboardModel;
  
  }
  
  
  export interface StatisticsResponse {
  
    statistics:
      DatasetStatistics;
  
  }