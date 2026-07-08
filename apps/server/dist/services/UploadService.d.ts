import type { UploadResponse } from "./types.js";
export declare class UploadService {
    private readonly ingestionEngine;
    private readonly qualityEngine;
    private readonly metadataEngine;
    private readonly statisticsEngine;
    processUpload(file: Express.Multer.File): Promise<UploadResponse>;
}
