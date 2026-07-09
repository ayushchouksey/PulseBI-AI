import type { Engine } from "../../core/engine.interface.js";
export declare class ExportEngine implements Engine<unknown, Buffer> {
    execute(dashboard: unknown): Buffer;
}
