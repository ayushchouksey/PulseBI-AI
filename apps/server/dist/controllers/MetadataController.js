import { MetadataService } from "../services/MetadataService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
export class MetadataController {
    service = new MetadataService();
    update = async (req, res) => {
        const datasetId = Array.isArray(req.params.datasetId)
            ? req.params.datasetId[0] // Extract the first string if it's an array
            : req.params.datasetId;
        const metadata = req.body;
        const result = await this.service.updateMetadata(datasetId, metadata);
        return res.json(buildSuccessResponse(result, "Metadata updated successfully."));
    };
}
//# sourceMappingURL=MetadataController.js.map