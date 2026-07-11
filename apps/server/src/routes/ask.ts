import { Router } from "express";
import { datasets } from "./upload.js";
import { buildExecutiveSummaryRequest } from "../engines/dashboard/dashboardEngine.js";
import { buildSummaryPrompt, buildChatPrompt } from "../engines/prompt/promptBuilder.js";
import { callOllama, callOllamaJSON, checkOllamaHealth } from "../providers/ollama/ollamaProvider.js";
import { detectIntent } from "../engines/intent/intentEngine.js";
import { executeQuery } from "../engines/query/queryEngine.js";
import type { ExecutiveSummary, DashboardJSON } from "@pulsebi/shared-types";
import { logger } from "../utils/logger.js";

const router = Router();

function buildFallbackSummary(dataset: { raw: { metadata: { rowCount: number; columnCount: number } }; dashboard: DashboardJSON }) {
  const summaryRequest = buildExecutiveSummaryRequest(dataset.dashboard);
  const highlights: string[] = [];

  if (summaryRequest.topPerformers.length > 0) {
    highlights.push(`Top performer: ${summaryRequest.topPerformers[0].name} (${summaryRequest.topPerformers[0].value})`);
  }
  if (summaryRequest.bottomPerformers.length > 0) {
    highlights.push(`Needs attention: ${summaryRequest.bottomPerformers[0].name}`);
  }
  if (Math.abs(summaryRequest.overallGrowth) > 0) {
    highlights.push(`Overall trend: ${summaryRequest.overallGrowth > 0 ? "+" : ""}${summaryRequest.overallGrowth.toFixed(1)}%`);
  }

  const warnings = dataset.dashboard.insights.filter((i) => i.type === "negative" || i.type === "warning");
  if (warnings.length > 0) {
    highlights.push(`Warning: ${warnings[0].title}`);
  }

  if (highlights.length === 0) {
    highlights.push(`Dataset contains ${dataset.raw.metadata.rowCount} records across ${dataset.raw.metadata.columnCount} columns`);
  }

  return {
    greeting: "Good Morning",
    summary: `Analysis of ${dataset.raw.metadata.rowCount} records across ${dataset.raw.metadata.columnCount} columns.`,
    highlights,
    followUpQuestions: ["What are the top performers?", "Show me trends over time", "Any outliers in the data?"],
  };
}

router.get("/:datasetId/summary", async (req, res) => {
  try {
    const dataset = datasets[req.params.datasetId];
    if (!dataset) {
      res.status(404).json({ success: false, error: "Dataset not found" });
      return;
    }

    const ollamaAvailable = await checkOllamaHealth();

    if (!ollamaAvailable) {
      res.json({ success: true, data: buildFallbackSummary(dataset) });
      return;
    }

    const summaryRequest = buildExecutiveSummaryRequest(dataset.dashboard);
    const prompt = buildSummaryPrompt(summaryRequest);

    try {
      const result = await callOllamaJSON<ExecutiveSummary>(prompt);
      res.json({ success: true, data: result });
    } catch (jsonErr) {
      logger.warn({ err: jsonErr instanceof Error ? jsonErr.message : String(jsonErr) }, "JSON parse failed, using raw text");

      const rawText = await callOllama(prompt);
      res.json({
        success: true,
        data: {
          greeting: "Good Morning",
          summary: rawText.slice(0, 500),
          highlights: summaryRequest.topPerformers.slice(0, 3).map((p) => `${p.name}: ${p.value}`),
          followUpQuestions: ["What are the top performers?", "Show me trends over time"],
        },
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ err: msg }, "Summary generation failed");
    res.status(500).json({ success: false, error: msg });
  }
});

router.post("/:datasetId/ask", async (req, res) => {
  try {
    const dataset = datasets[req.params.datasetId];
    if (!dataset) {
      res.status(404).json({ success: false, error: "Dataset not found" });
      return;
    }

    const { question } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ success: false, error: "Question is required" });
      return;
    }

    const columnNames = dataset.raw.metadata.columns.map((c: { name: string }) => c.name);
    const intent = detectIntent(question, columnNames);

    const queryResult = executeQuery({
      intent,
      question,
      metadata: dataset.raw.metadata,
      columnStatistics: dataset.statistics,
      dashboard: dataset.dashboard,
      rows: dataset.raw.rows,
    });

    const ollamaAvailable = await checkOllamaHealth();

    if (!ollamaAvailable) {
      res.json({
        success: true,
        data: {
          answer: queryResult.answer,
          intent,
          data: queryResult.data,
        },
      });
      return;
    }

    const summaryRequest = buildExecutiveSummaryRequest(dataset.dashboard);
    const prompt = buildChatPrompt({
      question,
      intent,
      summaryRequest,
      dashboard: dataset.dashboard,
      queryResult: queryResult.answer,
      queryData: queryResult.data,
    });

    try {
      const aiText = await callOllama(prompt);
      res.json({
        success: true,
        data: {
          answer: aiText || queryResult.answer,
          intent,
          data: queryResult.data,
        },
      });
    } catch (aiErr) {
      logger.warn({ err: aiErr instanceof Error ? aiErr.message : String(aiErr) }, "Ollama chat failed, using query result");
      res.json({
        success: true,
        data: {
          answer: queryResult.answer,
          intent,
          data: queryResult.data,
        },
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ err: msg }, "Query failed");
    res.status(500).json({ success: false, error: msg });
  }
});

router.get("/health/ollama", async (_req, res) => {
  const healthy = await checkOllamaHealth();
  res.json({ available: healthy });
});

export default router;
