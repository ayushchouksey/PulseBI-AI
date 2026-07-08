import type {
    Request,
    Response
  } from "express";
  
  import { ExportService } from "../services/ExportService.js";
  import { buildSuccessResponse } from "../utils/responseBuilder.js";
  
  export class ExportController {
  
    private readonly service =
      new ExportService();
  
    public export = async (
      req: Request,
      res: Response
    ) => {
  
      const result =
        await this.service.exportDashboard(
  
          req.body.dashboardId
  
        );
  
      return res.json(
  
        buildSuccessResponse(
  
          result,
  
          "Export completed"
  
        )
  
      );
  
    };
  
  }