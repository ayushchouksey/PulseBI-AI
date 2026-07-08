import { DataIngestionEngine } from "../engines/data-ingestion/index.js";
import { DataQualityEngine } from "../engines/data-quality/index.js";
import { MetadataEngine } from "../engines/metadata/index.js";
import { StatisticsEngine } from "../engines/statistics/index.js";
export class UploadService {
    ingestionEngine = new DataIngestionEngine();
    qualityEngine = new DataQualityEngine();
    metadataEngine = new MetadataEngine();
    statisticsEngine = new StatisticsEngine();
    async processUpload(file) {
        /**
         * ---------------------------------------
         * Step 1
         * Parse & Normalize uploaded CSV
         * ---------------------------------------
         */
        const dataset = await this.ingestionEngine.execute(file);
        /**
         * ---------------------------------------
         * Step 2
         * Run Data Quality Analysis
         * ---------------------------------------
         */
        const quality = this.qualityEngine.execute(dataset);
        /**
         * ---------------------------------------
         * Step 3
         * Generate Metadata
         * ---------------------------------------
         */
        const metadata = this.metadataEngine.execute(dataset);
        /**
         * ---------------------------------------
         * Step 4
         * Generate Dataset Statistics
         * ---------------------------------------
         */
        const statistics = this.statisticsEngine.execute({
            dataset,
            metadata,
            quality,
        });
        /**
         * ---------------------------------------
         * Final Upload Response
         * ---------------------------------------
         */
        return {
            dataset,
            quality,
            metadata,
            statistics,
        };
    }
}
//# sourceMappingURL=UploadService.js.map