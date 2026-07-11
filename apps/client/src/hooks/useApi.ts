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
  const { datasetId, addChatMessage, setAnalysis, updateDashboard } = useAppStore();

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

      if (data.analysis && data.intent.level === "analysis") {
        setAnalysis({
          id: crypto.randomUUID(),
          question,
          answer: data.answer,
          chart: data.analysis.chart,
          insights: data.analysis.insights,
          recommendations: data.analysis.recommendations,
          timestamp: new Date().toISOString(),
          pinned: false,
        });
      }

      if (data.dashboardPatch && data.intent.level === "dashboard_modification") {
        updateDashboard(data.dashboardPatch);
        setAnalysis(null);
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
