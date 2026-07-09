import type {
    Request,
    Response,
  } from "express";
  
  import { StatisticsService } from "../services/StatisticsService.js";
  import { buildSuccessResponse } from "../utils/responseBuilder.js";
  
  export class StatisticsController {
  
    private readonly service =
      new StatisticsService();
  
    public getStatistics = async (
      req: Request,
      res: Response
    ) => {
        const datasetId = Array.isArray(req.params.datasetId)
        ? req.params.datasetId[0] // Extract the first string if it's an array
        : req.params.datasetId;
      const statistics =
        await this.service.getStatistics(
          datasetId
        );
  
      return res.json(
  
        buildSuccessResponse(
  
          statistics,
  
          "Statistics retrieved successfully"
  
        )
  
      );
  
    };
  
  }