import type {
  Request,
  Response,
} from "express";

import { DatasetRepository } from "../repositories/index.js";


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

  private readonly repository =
    DatasetRepository.getInstance();

  getSession(
    datasetId: string
  ) {

    return this.repository.findById(
      datasetId
    );

  }

}