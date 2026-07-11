import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadCSV, getDashboard, askQuestion, getSummary, checkOllamaHealth } from "../services/api";
import { useAppStore } from "../stores/appStore";
import { useCallback } from "react";

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
    onError: () => {
      setUploading(false);
      setUploadProgress(0);
    },
  });
}

export function useDashboard(datasetId: string | null) {
  const { setDataset, metadata } = useAppStore();

  return useQuery({
    queryKey: ["dashboard", datasetId],
    queryFn: async () => {
      const dashboard = await getDashboard(datasetId!);
      if (metadata) {
        setDataset(datasetId!, metadata, dashboard);
      }
      return dashboard;
    },
    enabled: !!datasetId,
  });
}

export function useAskQuestion() {
  const { datasetId, addChatMessage } = useAppStore();

  return useMutation({
    mutationFn: (question: string) => {
      if (!datasetId) throw new Error("No dataset loaded");
      return askQuestion(datasetId, question);
    },
    onSuccess: (_data, question) => {
      addChatMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
      });
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
