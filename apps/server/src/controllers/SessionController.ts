import type {
    Request,
    Response
  } from "express";
  
  import { SessionService } from "../services/SessionService.js";
  import { buildSuccessResponse } from "../utils/responseBuilder.js";
  
  export class SessionController {
  
    private readonly service =
      new SessionService();
  
    public create = (
      _req: Request,
      res: Response
    ) => {
  
      const id =
        this.service.createSession();
  
      return res.json(
  
        buildSuccessResponse(
  
          { sessionId: id },
  
          "Session created"
  
        )
  
      );
  
    };
  
  }