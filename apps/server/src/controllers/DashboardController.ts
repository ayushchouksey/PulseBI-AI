import type {
  Request,
  Response,
} from "express";

import { DashboardService } from "../services/DashboardService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";

export class DashboardController {

  private readonly service =
    new DashboardService();

  public getDashboard = async (
    req: Request,
    res: Response
  ) => {
    const datasetId = Array.isArray(req.params.datasetId)
        ? req.params.datasetId[0] // Extract the first string if it's an array
        : req.params.datasetId;
    const dashboard =
      await this.service.getDashboard(
        datasetId
      );

    return res.json(

      buildSuccessResponse(

        dashboard,

        "Dashboard generated successfully"

      )

    );

  };

}