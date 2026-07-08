import { UploadService } from "../services/UploadService.js";
import { buildSuccessResponse } from "../utils/responseBuilder.js";
import { AppError } from "../utils/AppError.js";
export class UploadController {
    service = new UploadService();
    upload = async (req, res) => {
        const file = req.file;
        if (!file) {
            throw new AppError("UPLOAD_FILE_MISSING", 400, ["No CSV file was uploaded."]);
        }
        const result = await this.service.processUpload(file);
        return res.status(200).json(buildSuccessResponse(result, "File uploaded successfully."));
    };
}
//# sourceMappingURL=UploadController.js.map