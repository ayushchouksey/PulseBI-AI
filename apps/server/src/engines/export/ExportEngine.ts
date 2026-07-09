import type {
  Engine,
} from "../../core/engine.interface.js";

export interface ExportInput {

  dashboard: unknown;

  format: "json" | "pdf" | "csv";

}

export class ExportEngine
  implements Engine<
    ExportInput,
    Buffer
  >
{

  execute(
    input: ExportInput
  ): Buffer {

    switch (input.format) {

      case "json":

        return Buffer.from(

          JSON.stringify(
            input.dashboard,
            null,
            2
          )

        );

      case "csv":

        return Buffer.from(
          "CSV Export Coming Soon"
        );

      case "pdf":

        return Buffer.from(
          "PDF Export Coming Soon"
        );

      default:

        return Buffer.from(
          JSON.stringify(input.dashboard)
        );

    }

  }

}