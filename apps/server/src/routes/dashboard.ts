import { Router } from "express";
import { datasets } from "./upload.js";

const router = Router();

router.get("/:datasetId", (req, res) => {
  const dataset = datasets[req.params.datasetId];
  if (!dataset) {
    res.status(404).json({ success: false, error: "Dataset not found" });
    return;
  }
  res.json({ success: true, data: dataset.dashboard });
});

router.get("/:datasetId/kpis", (req, res) => {
  const dataset = datasets[req.params.datasetId];
  if (!dataset) {
    res.status(404).json({ success: false, error: "Dataset not found" });
    return;
  }
  res.json({ success: true, data: dataset.dashboard.kpis });
});

router.get("/:datasetId/charts", (req, res) => {
  const dataset = datasets[req.params.datasetId];
  if (!dataset) {
    res.status(404).json({ success: false, error: "Dataset not found" });
    return;
  }
  res.json({ success: true, data: dataset.dashboard.charts });
});

router.get("/:datasetId/insights", (req, res) => {
  const dataset = datasets[req.params.datasetId];
  if (!dataset) {
    res.status(404).json({ success: false, error: "Dataset not found" });
    return;
  }
  res.json({ success: true, data: dataset.dashboard.insights });
});

export default router;
