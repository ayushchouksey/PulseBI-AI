import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadCSV, getDashboard, askQuestion, getSummary, checkOllamaHealth } from "../services/api";
import { useAppStore } from "../stores/appStore";

export function useUploadCSV() {
  const { setDataset, setUploading, setUploadProgress } = useAppStore();

  return useMutation({
    mutationFn: (file: File) => {
      setUploading(true);
      setUploadProgress(0);
      return uploadCSV(file, (p) => setUploadProgress(p));
    },
    onSuccess: (data) => {
      setDataset(data.datasetId, data.metadata, data.dashboard);
      setUploading(false);
      setUploadProgress(100);
    },
    onError: () => { setUploading(false); setUploadProgress(0); },
  });
}

export function useDashboard(datasetId: string | null) {
  const { setDataset, metadata } = useAppStore();
  return useQuery({
    queryKey: ["dashboard", datasetId],
    queryFn: async () => {
      const dashboard = await getDashboard(datasetId!);
      if (metadata) setDataset(datasetId!, metadata, dashboard);
      return dashboard;
    },
    enabled: !!datasetId,
  });
}

export function useAskQuestion() {
  const { datasetId, addChatMessage, setAnalysis, updateDashboard, setHighlightedChartId } = useAppStore();

  return useMutation({
    mutationFn: (question: string) => {
      if (!datasetId) throw new Error("No dataset loaded");
      return askQuestion(datasetId, question);
    },
    onSuccess: (data, question) => {
      addChatMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
      });

      addChatMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toISOString(),
        aiResponse: data,
      });

      // Route by intent level to appropriate UI behavior
      switch (data.intent.level) {
        case "analysis": {
          setAnalysis({
            id: crypto.randomUUID(),
            question,
            answer: data.answer,
            chart: data.analysis?.chart,
            insights: data.analysis?.insights ?? [],
            recommendations: data.analysis?.recommendations ?? [],
            recommendation: data.recommendation,
            executiveBrief: data.executiveBrief,
            decisionSupport: data.decisionSupport,
            highlight: data.highlight,
            explain: data.explain,
            timestamp: new Date().toISOString(),
            pinned: false,
          });
          break;
        }

        case "recommendation":
        case "executive_brief":
        case "decision_support":
        case "explain": {
          setAnalysis({
            id: crypto.randomUUID(),
            question,
            answer: data.answer,
            chart: data.analysis?.chart,
            insights: data.analysis?.insights ?? [],
            recommendations: data.analysis?.recommendations ?? [],
            recommendation: data.recommendation,
            executiveBrief: data.executiveBrief,
            decisionSupport: data.decisionSupport,
            highlight: data.highlight,
            explain: data.explain,
            timestamp: new Date().toISOString(),
            pinned: false,
          });
          break;
        }

        case "highlight": {
          if (data.highlight?.chartId) {
            setHighlightedChartId(data.highlight.chartId);
            setTimeout(() => setHighlightedChartId(null), 5000);
          }
          break;
        }

        case "dashboard_modification": {
          if (data.dashboardPatch) {
            updateDashboard(data.dashboardPatch);
          }
          setAnalysis(null);
          break;
        }

        default: {
          // information mode — no UI changes
          setAnalysis(null);
        }
      }
    },
  });
}

export function useSummary(datasetId: string | null) {
  return useQuery({
    queryKey: ["summary", datasetId],
    queryFn: () => getSummary(datasetId!),
    enabled: !!datasetId,
  });
}

export function useOllamaHealth() {
  return useQuery({
    queryKey: ["ollama-health"],
    queryFn: checkOllamaHealth,
    refetchInterval: 30000,
    retry: 1,
  });
}
