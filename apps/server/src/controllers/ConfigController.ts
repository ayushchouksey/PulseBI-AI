import type { Request, Response } from "express";
import { ConfigService } from "../services/ConfigService.js";

export class ConfigController {
  static async getConfig(_req: Request, res: Response) {
    const config = await ConfigService.getPublicConfig();

    res.json(config);
  }
}