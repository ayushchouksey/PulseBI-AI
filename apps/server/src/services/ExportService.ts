import { ExportEngine } from "../engines/export/ExportEngine.js";

export class ExportService {

  private engine = new ExportEngine();

  public async exportDashboard(
    dashboardId: string
  ) {

    await this.engine.export({});

    return {

      dashboardId,

      url: "/exports/dashboard.pdf"

    };

  }

}