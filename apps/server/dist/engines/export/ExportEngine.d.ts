import type { Engine } from "../../core/engine.interface.js";
export interface ExportInput {
    dashboard: unknown;
    format: "json" | "pdf" | "csv";
}
export declare class ExportEngine implements Engine<ExportInput, Buffer> {
    execute(input: ExportInput): Buffer;
}
