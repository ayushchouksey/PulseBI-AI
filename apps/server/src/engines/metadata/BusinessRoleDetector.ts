import type {
    BusinessRole,
    ColumnType,
  } from "@pulsebi/shared-types";
  
  export class BusinessRoleDetector {
    execute(
      columnName: string,
      type: ColumnType
    ): BusinessRole {
      const name = columnName.toLowerCase();
  
      if (
        name.includes("date") ||
        type === "date"
      ) {
        return "date";
      }
  
      if (
        name.includes("id") ||
        name.includes("code")
      ) {
        return "identifier";
      }
  
      if (
        type === "number"
      ) {
        return "metric";
      }
  
      return "category";
    }
  }