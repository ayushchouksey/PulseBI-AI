import { ExportService } from "../services/ExportService.js";
export class ExportController {
    service = new ExportService();
    export = async (req, res) => {
        const datasetId = Array.isArray(req.params.datasetId)
            ? req.params.datasetId[0]
            : req.params.datasetId;
        const format = (Array.isArray(req.params.format)
            ? req.params.format[0]
            : req.params.format ?? "json");
        const file = await this.service.exportDashboard(datasetId, format);
        switch (format) {
            case "json":
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Content-Disposition", 'attachment; filename="dashboard.json"');
                break;
            case "csv":
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", 'attachment; filename="dashboard.csv"');
                break;
            case "pdf":
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'attachment; filename="dashboard.pdf"');
                break;
        }
        return res.send(file);
    };
}
//# sourceMappingURL=ExportController.js.map