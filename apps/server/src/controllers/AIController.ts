import type {
  Request,
  Response,
} from "express";

import { AIService } from "../services/AIService.js";

import { buildSuccessResponse } from "../utils/responseBuilder.js";

export class AIController {

  private readonly service =
    new AIService();

  public ask = async (
    req: Request,
    res: Response
  ) => {

    const result =
      await this.service.ask(

        req.body.datasetId,

        req.body.question

      );

    return res.json(

      buildSuccessResponse(

        result,

        "AI response generated"

      )

    );

  };

}