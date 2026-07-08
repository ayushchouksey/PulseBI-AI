import type { BusinessRole, ColumnType } from "@pulsebi/shared-types";
export declare class BusinessRoleDetector {
    execute(columnName: string, type: ColumnType): BusinessRole;
}
