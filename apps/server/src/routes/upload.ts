import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseCSV } from "../engines/ingestion/csvParser.js";
import { detectMetadata } from "../engines/metadata/metadataEngine.js";
import { computeColumnStatistics, computeTrend, computeCorrelations } from "../engines/statistics/statisticsEngine.js";
import { generateDashboardJSON } from "../engines/business/businessEngine.js";
import type { RawCSVData } from "../engines/ingestion/csvParser.js";
import type { MetadataEngineResult } from "../engines/metadata/metadataEngine.js";
import type { ColumnStatistics, TrendResult, CorrelationResult, DashboardJSON } from "@pulsebi/shared-types";
import { logger } from "../utils/logger.js";

const router = Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

interface DatasetStore {
  [id: string]: {
    raw: RawCSVData;
    metadata: MetadataEngineResult;
    statistics: ColumnStatistics[];
    trends: TrendResult[];
    correlations: CorrelationResult[];
    dashboard: DashboardJSON;
  };
}

const datasets: DatasetStore = {};

export { datasets };

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }

    logger.info({ filename: req.file.originalname, size: req.file.size }, "Processing CSV upload");

    const raw = parseCSV(req.file.path, req.file.originalname);
    const metadata = detectMetadata(raw.metadata);

    const measureCols = metadata.measureColumns.map((c) => c.name);
    const dateCols = metadata.dateColumns.map((c) => c.name);

    const statistics: ColumnStatistics[] = measureCols.map((col) => {
      const values = raw.rows.map((r) => r[col]);
      return computeColumnStatistics(values, col);
    });

    const trends: TrendResult[] = [];
    for (const dc of dateCols) {
      for (const mc of measureCols.slice(0, 3)) {
        const trend = computeTrend(raw.rows, dc, mc);
        if (trend) trends.push(trend);
      }
    }

    const correlations = computeCorrelations(raw.rows, measureCols);

    const dashboard = generateDashboardJSON({
      metadata: raw.metadata,
      columnStatistics: statistics,
      trends,
      correlations,
      rows: raw.rows,
    });

    datasets[raw.metadata.id] = { raw, metadata, statistics, trends, correlations, dashboard };

    logger.info({ datasetId: raw.metadata.id, rows: raw.metadata.rowCount }, "Dataset processed successfully");

    res.json({
      success: true,
      data: {
        datasetId: raw.metadata.id,
        metadata: raw.metadata,
        dashboard,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ err: msg }, "Upload processing failed");
    res.status(500).json({ success: false, error: msg });
  }
});

router.get("/:id", (req, res) => {
  const dataset = datasets[req.params.id];
  if (!dataset) {
    res.status(404).json({ success: false, error: "Dataset not found" });
    return;
  }
  res.json({ success: true, data: dataset.dashboard });
});

export default router;
