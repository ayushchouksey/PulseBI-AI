import type { Request, Response } from "express";
import { HealthService } from "../services/HealthService.js";

export class HealthController {
  static async getHealth(_req: Request, res: Response) {
    const result = await HealthService.getHealth();

    res.json(result);
  }
}