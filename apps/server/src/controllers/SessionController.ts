import type {
  Request,
  Response,
} from "express";

import { buildSuccessResponse } from "../utils/responseBuilder.js";

export class SessionController {

  public create = async (
    _req: Request,
    res: Response
  ) => {

    return res.json(

      buildSuccessResponse(

        {

          sessionId:
            crypto.randomUUID(),

        },

        "Session created"

      )

    );

  };

}