import { Router } from "express";
import { datasets } from "./upload.js";
import { buildExecutiveSummaryRequest } from "../engines/dashboard/dashboardEngine.js";
import { buildSummaryPrompt, buildChatPrompt } from "../engines/prompt/promptBuilder.js";
import { callOllama, callOllamaJSON, checkOllamaHealth } from "../providers/ollama/ollamaProvider.js";
import { detectIntent } from "../engines/intent/intentEngine.js";
import { executeQuery } from "../engines/query/queryEngine.js";
import type { ExecutiveSummary, DashboardJSON, AIResponse } from "@pulsebi/shared-types";
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
  if (warnings.length > 0) highlights.push(`Warning: ${warnings[0].title}`);
  if (highlights.length === 0) highlights.push(`Dataset contains ${dataset.raw.metadata.rowCount} records across ${dataset.raw.metadata.columnCount} columns`);

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
    if (!dataset) { res.status(404).json({ success: false, error: "Dataset not found" }); return; }

    const ollamaAvailable = await checkOllamaHealth();
    if (!ollamaAvailable) { res.json({ success: true, data: buildFallbackSummary(dataset) }); return; }

    const summaryRequest = buildExecutiveSummaryRequest(dataset.dashboard);
    const prompt = buildSummaryPrompt(summaryRequest);

    try {
      const result = await callOllamaJSON<ExecutiveSummary>(prompt);
      res.json({ success: true, data: result });
    } catch {
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
    if (!dataset) { res.status(404).json({ success: false, error: "Dataset not found" }); return; }

    const { question } = req.body;
    if (!question || typeof question !== "string") { res.status(400).json({ success: false, error: "Question is required" }); return; }

    const columnNames = dataset.raw.metadata.columns.map((c: { name: string }) => c.name);
    const intent = detectIntent(question, columnNames);

    // Step 1: Node executes the query deterministically
    const aiResponse: AIResponse = executeQuery({
      intent,
      question,
      metadata: dataset.raw.metadata,
      columnStatistics: dataset.statistics,
      dashboard: dataset.dashboard,
      rows: dataset.raw.rows,
    });

    // Step 2: If DASHBOARD_MODIFICATION, apply the patch to stored dashboard
    if (intent.level === "dashboard_modification" && aiResponse.dashboardPatch) {
      const current = dataset.dashboard;
      dataset.dashboard = {
        ...current,
        ...aiResponse.dashboardPatch,
        charts: aiResponse.dashboardPatch.charts ?? current.charts,
        kpis: aiResponse.dashboardPatch.kpis ?? current.kpis,
        insights: aiResponse.dashboardPatch.insights ?? current.insights,
      };
    }

    // Step 3: For dashboard modifications, use Node answer directly (Ollama doesn't know dashboard state)
    if (intent.level === "dashboard_modification") {
      res.json({ success: true, data: aiResponse });
      return;
    }

    // Step 4: If Ollama available, let it explain the verified results
    const ollamaAvailable = await checkOllamaHealth();
    if (!ollamaAvailable) {
      res.json({ success: true, data: aiResponse });
      return;
    }

    const summaryRequest = buildExecutiveSummaryRequest(dataset.dashboard);
    const prompt = buildChatPrompt({
      question,
      intent,
      summaryRequest,
      dashboard: dataset.dashboard,
      queryResult: aiResponse.answer,
      queryData: aiResponse.analysis?.chart?.config?.data as Record<string, unknown>[] | undefined,
    });

    try {
      const aiText = await callOllama(prompt);
      if (aiText) aiResponse.answer = aiText;
    } catch (aiErr) {
      logger.warn({ err: aiErr instanceof Error ? aiErr.message : String(aiErr) }, "Ollama failed, using Node answer");
    }

    res.json({ success: true, data: aiResponse });
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
