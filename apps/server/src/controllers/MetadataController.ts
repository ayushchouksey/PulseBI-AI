import type {
    Request,
    Response,
  } from "express";
  
  import type {
    ColumnMetadata,
  } from "@pulsebi/shared-types";
  
  import { MetadataService } from "../services/MetadataService.js";
  import { buildSuccessResponse } from "../utils/responseBuilder.js";
  
  export class MetadataController {
  
    private readonly service =
      new MetadataService();
  
    public update = async (
      req: Request,
      res: Response
    ) => {
  
        const datasetId = Array.isArray(req.params.datasetId)
        ? req.params.datasetId[0] // Extract the first string if it's an array
        : req.params.datasetId;
  
      const metadata =
        req.body as ColumnMetadata[];
  
      const result =
        await this.service.updateMetadata(
  
          datasetId,
  
          metadata
  
        );
  
      return res.json(
  
        buildSuccessResponse(
  
          result,
  
          "Metadata updated successfully."
  
        )
  
      );
  
    };
  
  }