import type {
  Engine,
} from "../../core/engine.interface.js";

export class ExportEngine
  implements Engine<
    unknown,
    Buffer
  >
{

  execute(
    dashboard: unknown
  ): Buffer {

    return Buffer.from(

      JSON.stringify(
        dashboard,
        null,
        2
      )

    );

  }

}