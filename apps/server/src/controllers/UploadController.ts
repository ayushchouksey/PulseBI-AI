import type {
    Request,
    Response,
  } from "express";
  
  import { UploadService } from "../services/UploadService.js";
  import { buildSuccessResponse } from "../utils/responseBuilder.js";
  import { AppError } from "../utils/AppError.js";
  
  export class UploadController {
  
    private readonly service =
      new UploadService();
  
    public upload = async (
      req: Request,
      res: Response
    ) => {
  
      const file =
        (req as Request & {
          file?: Express.Multer.File;
        }).file;
  
      if (!file) {
        throw new AppError(
          "UPLOAD_FILE_MISSING",
          400,
          ["No CSV file was uploaded."]
        );
      }
  
      const result =
        await this.service.processUpload(file);
  
      return res.status(200).json(
  
        buildSuccessResponse(
  
          result,
  
          "File uploaded successfully."
  
        )
  
      );
  
    };
  
  }