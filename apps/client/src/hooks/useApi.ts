import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadCSV, getDashboard, askQuestion, getSummary } from "../services/api";
import { useAppStore } from "../stores/appStore";

export function useUploadCSV() {
  const setDataset = useAppStore((s) => s.setDataset);
  const setUploading = useAppStore((s) => s.setUploading);
  const setUploadProgress = useAppStore((s) => s.setUploadProgress);

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

export function useAskQuestion() {
  const datasetId = useAppStore((s) => s.datasetId);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const setAnalysis = useAppStore((s) => s.setAnalysis);
  const updateDashboard = useAppStore((s) => s.updateDashboard);
  const setHighlightedChartId = useAppStore((s) => s.setHighlightedChartId);

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

      switch (data.intent.level) {
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
