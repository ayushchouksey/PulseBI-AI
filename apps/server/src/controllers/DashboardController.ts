import type {
    Request,
    Response
  } from "express";
  
  import { DashboardService } from "../services/DashboardService.js";
  import { buildSuccessResponse } from "../utils/responseBuilder.js";
  
  export class DashboardController {
  
    private readonly service =
      new DashboardService();
  
    public generate = async (
      req: Request,
      res: Response
    ) => {
  
      const result =
        await this.service.generateDashboard(
  
          req.body.datasetId
  
        );
  
      return res.json(
  
        buildSuccessResponse(
  
          result,
  
          "Dashboard generated"
  
        )
  
      );
  
    };
  
  }