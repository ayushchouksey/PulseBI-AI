import type {
  Request,
  Response,
} from "express";

import { ExportService } from "../services/ExportService.js";

export class ExportController {

  private readonly service =
    new ExportService();

  public export = async (
    req: Request,
    res: Response
  ) => {

    const datasetId = Array.isArray(req.params.datasetId)
      ? req.params.datasetId[0]
      : req.params.datasetId;

    const format = (
      Array.isArray(req.params.format)
        ? req.params.format[0]
        : req.params.format ?? "json"
    ) as "json" | "csv" | "pdf";

    const file =
      await this.service.exportDashboard(
        datasetId,
        format
      );

    switch (format) {

      case "json":

        res.setHeader(
          "Content-Type",
          "application/json"
        );

        res.setHeader(
          "Content-Disposition",
          'attachment; filename="dashboard.json"'
        );

        break;

      case "csv":

        res.setHeader(
          "Content-Type",
          "text/csv"
        );

        res.setHeader(
          "Content-Disposition",
          'attachment; filename="dashboard.csv"'
        );

        break;

      case "pdf":

        res.setHeader(
          "Content-Type",
          "application/pdf"
        );

        res.setHeader(
          "Content-Disposition",
          'attachment; filename="dashboard.pdf"'
        );

        break;

    }

    return res.send(file);

  };

}