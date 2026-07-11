export type ColumnType = "currency" | "date" | "percentage" | "text" | "boolean" | "id" | "integer" | "decimal";

export type ColumnRole = "dimension" | "measure";

export interface ColumnMetadata {
  name: string;
  detectedType: ColumnType;
  role: ColumnRole;
  nullable: boolean;
  uniqueCount: number;
  totalCount: number;
  emptyCount: number;
  sampleValues: string[];
  format?: string;
}

export interface DatasetMetadata {
  id: string;
  filename: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnMetadata[];
  detectedAt: string;
}

export interface StatisticsResult {
  count: number;
  sum: number;
  avg: number;
  median: number;
  mode: number | null;
  min: number;
  max: number;
  stdDev: number;
  variance: number;
  q1: number;
  q3: number;
  iqr: number;
  range: number;
  cv: number;
  outliers: number;
  outlierValues: number[];
  percentiles: Record<number, number>;
}

export interface ColumnStatistics {
  columnName: string;
  stats: StatisticsResult;
  histogram?: HistogramBin[];
  topValues?: NameValuePair[];
  bottomValues?: NameValuePair[];
}

export interface HistogramBin {
  label: string;
  min: number;
  max: number;
  count: number;
}

export interface NameValuePair {
  name: string;
  value: number;
  percentage: number;
}

export interface TrendResult {
  dateColumn: string;
  valueColumn: string;
  direction: "up" | "down" | "flat";
  avgChange: number;
  changePercent: number;
  dataPoints: TrendDataPoint[];
}

export interface TrendDataPoint {
  period: string;
  value: number;
  count: number;
}

export interface CorrelationResult {
  col1: string;
  col2: string;
  r: number;
  strength: "strong" | "moderate" | "weak";
  direction: "positive" | "negative";
}

export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "area"
  | "histogram"
  | "treemap"
  | "heatmap"
  | "box"
  | "funnel";

export interface RecommendedChart {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  dataSource: string;
  priority: number;
  config: Record<string, unknown>;
}

export interface KPI {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  previousValue?: number;
  changePercent?: number;
  trend?: "up" | "down" | "flat";
  format: "currency" | "number" | "percentage" | "decimal";
  icon?: string;
  description: string;
}

export interface BusinessInsight {
  id: string;
  type: "positive" | "negative" | "warning" | "info";
  title: string;
  description: string;
  metric?: string;
  value?: number;
  severity: "high" | "medium" | "low";
}

export interface DashboardWidget {
  id: string;
  type: "kpi" | "chart" | "insight" | "table";
  title: string;
  chart?: RecommendedChart;
  kpi?: KPI;
  insight?: BusinessInsight;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  columns: number;
  rowHeight: number;
}

export interface DashboardJSON {
  id: string;
  datasetId: string;
  title: string;
  subtitle: string;
  generatedAt: string;
  layout: DashboardLayout;
  kpis: KPI[];
  charts: RecommendedChart[];
  insights: BusinessInsight[];
}

// ─── Five Operating Modes ────────────────────────────────────────

export type IntentLevel =
  | "information"       // Answer only — no dashboard change
  | "analysis"          // Temporary analysis card + optional chart
  | "recommendation"    // Business priorities + expected impact
  | "executive_brief"   // CEO-style brief with metrics
  | "decision_support"  // Data-backed decision with confidence
  | "highlight"         // Highlight existing chart/widget
  | "explain"           // Text-only explanation (no chart)
  | "dashboard_modification"; // Permanent dashboard change

export type IntentType =
  | "highest"
  | "lowest"
  | "compare"
  | "trend"
  | "filter"
  | "sort"
  | "top"
  | "bottom"
  | "average"
  | "count"
  | "sum"
  | "explain"
  | "summary"
  | "recommendation"
  | "executive_brief"
  | "decision_support"
  | "highlight"
  | "chart_add"
  | "chart_remove"
  | "chart_replace"
  | "kpi_add"
  | "kpi_remove"
  | "unknown";

export interface DetectedIntent {
  level: IntentLevel;
  type: IntentType;
  metric?: string;
  dimension?: string;
  timePeriod?: string;
  filter?: { column: string; value: string | number };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
}

// ─── Mode-Specific Response Types ────────────────────────────────

export interface RecommendationResult {
  title: string;
  priorities: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    metric?: string;
    currentValue?: string;
  }[];
  expectedImpact: "high" | "medium" | "low";
  reasoning: string;
}

export interface ExecutiveBrief {
  title: string;
  metrics: {
    label: string;
    value: string;
    change?: number;
    direction?: "up" | "down" | "flat";
  }[];
  risks: string[];
  opportunities: string[];
  recommendation: string;
}

export interface DecisionSupport {
  title: string;
  question: string;
  verdict: "yes" | "no" | "conditional";
  confidence: "high" | "medium" | "low";
  factors: {
    label: string;
    value: string;
    change?: number;
    direction?: "up" | "down" | "flat";
  }[];
  reasoning: string;
}

export interface HighlightAction {
  chartId: string;
  chartTitle: string;
  highlightData?: { label: string; value: string }[];
 Insight: string;
}

export interface ExplainResult {
  title: string;
  explanation: string;
  causes: string[];
  recommendation?: string;
}

// ─── Analysis & Response ─────────────────────────────────────────

export interface AnalysisChart {
  id: string;
  chart: RecommendedChart;
  insights: BusinessInsight[];
  recommendations: string[];
}

export interface AIResponse {
  intent: DetectedIntent;
  answer: string;
  analysis?: AnalysisChart;
  recommendation?: RecommendationResult;
  executiveBrief?: ExecutiveBrief;
  decisionSupport?: DecisionSupport;
  highlight?: HighlightAction;
  explain?: ExplainResult;
  dashboardPatch?: Partial<DashboardJSON>;
}

export interface AnalysisResult {
  id: string;
  question: string;
  answer: string;
  chart?: RecommendedChart;
  insights: BusinessInsight[];
  recommendations: string[];
  recommendation?: RecommendationResult;
  executiveBrief?: ExecutiveBrief;
  decisionSupport?: DecisionSupport;
  highlight?: HighlightAction;
  explain?: ExplainResult;
  timestamp: string;
  pinned: boolean;
}

// ─── Existing Types ──────────────────────────────────────────────

export interface ExecutiveSummaryRequest {
  topPerformers: NameValuePair[];
  bottomPerformers: NameValuePair[];
  overallGrowth: number;
  keyTrends: TrendResult[];
  warnings: BusinessInsight[];
  outliers: { column: string; count: number }[];
}

export interface ExecutiveSummary {
  greeting: string;
  summary: string;
  highlights: string[];
  followUpQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  aiResponse?: AIResponse;
}

export interface DatasetContext {
  datasetId: string;
  metadata: DatasetMetadata;
  statistics: ColumnStatistics[];
  dashboard: DashboardJSON;
  currentFilters: FilterState[];
  conversationHistory: ChatMessage[];
}

export interface FilterState {
  column: string;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains" | "in";
  value: string | number | (string | number)[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  datasetId: string;
  metadata: DatasetMetadata;
}

export interface ChartDataPoint {
  [key: string]: string | number;
}
