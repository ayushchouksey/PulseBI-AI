import type {
  Request,
  Response,
} from "express";

export class HealthController {

  public health = (
    _req: Request,
    res: Response
  ) => {

    res.json({

      status: "UP",

      version: "1.0.0",

      uptime: process.uptime(),

      memory: process.memoryUsage(),

      timestamp:
        new Date().toISOString(),

    });

  };

}