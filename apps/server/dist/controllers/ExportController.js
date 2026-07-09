import { ExportService } from "../services/ExportService.js";
export class ExportController {
    service = new ExportService();
    export = async (req, res) => {
        const datasetId = Array.isArray(req.params.datasetId)
            ? req.params.datasetId[0] // Extract the first string if it's an array
            : req.params.datasetId;
        const file = await this.service.exportDashboard(datasetId);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", 'attachment; filename="dashboard.json"');
        return res.send(file);
    };
}
//# sourceMappingURL=ExportController.js.map