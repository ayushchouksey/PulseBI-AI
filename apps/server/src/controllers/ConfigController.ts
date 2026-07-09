import type {
  Request,
  Response,
} from "express";

import { config } from "../config/index.js";

export class ConfigController {

  public get = (
    _req: Request,
    res: Response
  ) => {

    return res.json({

      upload: config.upload,

      server: {

        port:
          config.port,

      },

    });

  };

}