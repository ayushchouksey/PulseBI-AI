import type {
    ColumnMetadata,
  } from "@pulsebi/shared-types";
  
  import type {
    DashboardFilter,
  } from "./types.js";
  
  export class FilterBuilder {
  
    execute(
      metadata: ColumnMetadata[]
    ): DashboardFilter[] {
  
      const filters: DashboardFilter[] = [];
  
      metadata.forEach(column => {
  
        if (column.businessRole === "category") {
  
          filters.push({
  
            field: column.originalName,
  
            type: "select",
  
          });
  
        }
  
        if (column.businessRole === "date") {
  
          filters.push({
  
            field: column.originalName,
  
            type: "date",
  
          });
  
        }
  
      });
  
      return filters;
  
    }
  
  }