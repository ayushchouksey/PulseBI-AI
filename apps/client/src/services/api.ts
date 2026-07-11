import type { ApiResponse, DashboardJSON, KPI, RecommendedChart, BusinessInsight, DatasetMetadata, AIResponse } from "@pulsebi/shared-types";

const API_BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  const json = await res.json() as ApiResponse<T>;
  if (!json.success) throw new Error(json.error || "Unknown error");
  return json.data as T;
}

export interface UploadResult {
  datasetId: string;
  metadata: DatasetMetadata;
  dashboard: DashboardJSON;
}

export async function uploadCSV(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/upload`);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        json.success ? resolve(json.data) : reject(new Error(json.error || "Upload failed"));
      } catch { reject(new Error("Invalid response")); }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}

export async function getDashboard(datasetId: string): Promise<DashboardJSON> {
  return request<DashboardJSON>(`/dashboard/${datasetId}`);
}

export async function getKPIs(datasetId: string): Promise<KPI[]> {
  return request<KPI[]>(`/dashboard/${datasetId}/kpis`);
}

export async function getCharts(datasetId: string): Promise<RecommendedChart[]> {
  return request<RecommendedChart[]>(`/dashboard/${datasetId}/charts`);
}

export async function getInsights(datasetId: string): Promise<BusinessInsight[]> {
  return request<BusinessInsight[]>(`/dashboard/${datasetId}/insights`);
}

export async function askQuestion(datasetId: string, question: string): Promise<AIResponse> {
  return request<AIResponse>(`/ask/${datasetId}/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function getSummary(datasetId: string): Promise<{ greeting: string; summary: string; highlights: string[]; followUpQuestions: string[] }> {
  return request(`/ask/${datasetId}/summary`);
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/ask/health/ollama`);
    const data = await res.json() as { available: boolean };
    return data.available;
  } catch { return false; }
}
