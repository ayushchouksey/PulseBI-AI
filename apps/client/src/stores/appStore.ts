import { create } from "zustand";
import type { DashboardJSON, ChatMessage, DatasetMetadata, FilterState, AnalysisResult } from "@pulsebi/shared-types";

interface AppState {
  datasetId: string | null;
  metadata: DatasetMetadata | null;
  dashboard: DashboardJSON | null;
  chatMessages: ChatMessage[];
  analysis: AnalysisResult | null;
  filters: FilterState[];
  sidebarOpen: boolean;
  chatOpen: boolean;
  isUploading: boolean;
  uploadProgress: number;

  setDataset: (id: string, metadata: DatasetMetadata, dashboard: DashboardJSON) => void;
  updateDashboard: (patch: Partial<DashboardJSON>) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  pinAnalysisToDashboard: () => void;
  addFilter: (filter: FilterState) => void;
  removeFilter: (column: string) => void;
  clearFilters: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  datasetId: null,
  metadata: null,
  dashboard: null,
  chatMessages: [],
  analysis: null,
  filters: [],
  sidebarOpen: true,
  chatOpen: false,
  isUploading: false,
  uploadProgress: 0,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setDataset: (id, metadata, dashboard) =>
    set({ datasetId: id, metadata, dashboard }),

  updateDashboard: (patch) =>
    set((state) => ({
      dashboard: state.dashboard ? { ...state.dashboard, ...patch } : null,
    })),

  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  clearChat: () => set({ chatMessages: [] }),

  setAnalysis: (analysis) => set({ analysis }),

  pinAnalysisToDashboard: () =>
    set((state) => {
      if (!state.analysis?.chart || !state.dashboard) return state;
      return {
        dashboard: {
          ...state.dashboard,
          charts: [...state.dashboard.charts, state.analysis.chart],
        },
        analysis: state.analysis ? { ...state.analysis, pinned: true } : null,
      };
    }),

  addFilter: (filter) =>
    set((state) => ({ filters: [...state.filters.filter((f) => f.column !== filter.column), filter] })),

  removeFilter: (column) =>
    set((state) => ({ filters: state.filters.filter((f) => f.column !== column) })),

  clearFilters: () => set({ filters: [] }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  setUploading: (uploading) => set({ isUploading: uploading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  reset: () => set(initialState),
}));
