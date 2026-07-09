import type {
    ColumnMetadata,
    Dataset,
    DataQualityReport,
    DatasetStatistics,
  } from "@pulsebi/shared-types";
  
  import type { StoredDataset } from "./types.js";
  
  export class DatasetRepository {
  
    private static instance: DatasetRepository;
  
    private readonly datasets =
      new Map<string, StoredDataset>();
  
    private constructor() {}
  
    public static getInstance(): DatasetRepository {
  
      if (!DatasetRepository.instance) {
  
        DatasetRepository.instance =
          new DatasetRepository();
  
      }
  
      return DatasetRepository.instance;
  
    }
  
    public save(input: {
  
      dataset: Dataset;
  
      metadata: ColumnMetadata[];
  
      quality: DataQualityReport;
  
      statistics: DatasetStatistics;
  
    }): StoredDataset {
  
      const stored: StoredDataset = {
  
        dataset: input.dataset,
  
        metadata: input.metadata,
  
        quality: input.quality,
  
        statistics: input.statistics,
  
        uploadedAt: new Date(),
  
      };
  
      this.datasets.set(
        input.dataset.id,
        stored
      );
  
      return stored;
  
    }
  
    public findById(
      datasetId: string
    ): StoredDataset | undefined {
  
      return this.datasets.get(datasetId);
  
    }
  
    public findAll(): StoredDataset[] {
  
      return Array.from(
        this.datasets.values()
      );
  
    }

    public exists(
        datasetId: string
      ): boolean {
      
        return this.datasets.has(
          datasetId
        );
      
      }
      
  
    public updateMetadata(
  
      datasetId: string,
  
      metadata: ColumnMetadata[],
  
      statistics: DatasetStatistics
  
    ): StoredDataset | undefined {
  
      const stored =
        this.datasets.get(datasetId);
  
      if (!stored) {
  
        return undefined;
  
      }
  
      stored.metadata = metadata;
  
      stored.statistics = statistics;
  
      return stored;
  
    }
  
    public delete(
      datasetId: string
    ): boolean {
  
      return this.datasets.delete(datasetId);
  
    }

    public clear(): void {

        this.datasets.clear();
      
      }
  
  }