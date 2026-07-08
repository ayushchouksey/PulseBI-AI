export interface ColumnQuality {
    columnName: string;
  
    missingValues: number;
  
    missingPercentage: number;
  
    uniqueValues: number;
  
    duplicateValues: number;
  
    isConstant: boolean;
  
    isHighCardinality: boolean;
  
    sampleValues: string[];
  }
  
  export interface QualityIssue {
    severity: "error" | "warning";
  
    code: string;
  
    message: string;
  }
  
  export interface DataQualityReport {
    score: number;
  
    totalRows: number;
  
    totalColumns: number;
  
    duplicateRows: number;
  
    emptyRows: number;
  
    columns: ColumnQuality[];
  
    issues: QualityIssue[];
  }