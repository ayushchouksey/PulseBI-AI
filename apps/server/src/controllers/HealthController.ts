import type {
  Request,
  Response,
} from "express";

export class HealthController {

  public health = (
    _req: Request,
    res: Response
  ) => {

    return res.json({

      status: "UP",

      service: "PulseBI AI",

      timestamp: new Date().toISOString(),

    });

  };

}