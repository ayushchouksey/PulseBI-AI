# PulseBI — Architecture Walkthrough

## 1. System Overview

PulseBI is an AI-powered business intelligence tool that lets non-technical business users upload a CSV, instantly get an interactive dashboard with KPIs/charts/insights, and then ask follow-up questions in natural language. The LLM (Groq cloud or Ollama local) powers conversational analytics — not data processing.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React SPA)                        │
│                                                                     │
│  LandingPage ──→ DashboardPage ──→ ChatPanel + AnalysisPanel        │
│       │              │                    │                          │
│       ▼              ▼                    ▼                          │
│   Zustand Store  Plotly Charts    React Query (mutations)           │
│       │              │                    │                          │
│       └──────────────┴────────────────────┘                         │
│                          │  HTTP                                     │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  VITE PROXY │  /api → localhost:3001
                    └──────┬──────┘
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                    SERVER (Express API)                              │
│                          │                                          │
│   ┌──────────────────────┼──────────────────────────┐               │
│   │              API Routes                         │               │
│   │  /api/upload  /api/dashboard  /api/ask          │               │
│   └──────┬───────────────┬──────────────┬───────────┘               │
│          │               │              │                            │
│   ┌──────▼──────┐  ┌─────▼─────┐  ┌────▼───────────────────┐       │
│   │  Ingestion  │  │ Dashboard │  │  Intent → Query → LLM   │       │
│   │  Pipeline   │  │  Engine   │  │  Engine  Engine Provider │       │
│   └─────────────┘  └───────────┘  └────────────────────────┘       │
│                                                      │               │
│                                              ┌───────▼───────┐      │
│                                              │ Groq (cloud)  │      │
│                                              │ or Ollama     │      │
│                                              │ (local)       │      │
│                                              └───────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Structure

### Client (`apps/client/src/`)

```
components/ui/          — Reusable primitives (Button, Card, Modal, Toast)
  ├── MetricCard.tsx        Displays a single KPI with trend icon
  └── Toast.tsx             Lightweight toast notification system

features/
  ├── chat/
  │   └── ChatPanel.tsx     Conversational AI panel with markdown rendering
  │                         Supports 8 intent levels with contextual UI
  └── dashboard/
      ├── DashboardPage.tsx  Main orchestrator — assembles all dashboard pieces
      ├── ChartRenderer.tsx  Plotly wrapper with 6 chart types (bar/line/pie/scatter/area/histogram)
      ├── AnalysisPanel.tsx  Transient AI analysis panel with Pin-to-Dashboard
      ├── InsightList.tsx    Business insight cards with severity color-coding
      └── SummaryBar.tsx     Executive summary banner with suggested questions

hooks/
  └── useApi.ts             React Query hooks (useUploadCSV, useAskQuestion, useSummary)

pages/
  └── LandingPage.tsx       CSV upload page with drag-and-drop

stores/
  └── appStore.ts           Zustand store — single source of truth for app state

services/
  └── api.ts                HTTP client wrapping fetch()

utils/
  └── exportPdf.ts          PDF export (chart, analysis panel, full dashboard)
```

### Server (`apps/server/src/`)

```
engines/
  ├── ingestion/csvParser.ts     CSV parsing with PapaParse
  ├── metadata/metadataEngine.ts Column type detection (date/numeric/categorical)
  ├── statistics/statisticsEngine.ts  Descriptive stats, correlations, outliers
  ├── business/businessEngine.ts Auto-generates KPIs, charts, insights from data
  ├── intent/intentEngine.ts     Rule-based intent classification (no LLM needed)
  ├── prompt/promptBuilder.ts    Constructs LLM prompts from data context
  ├── query/queryEngine.ts       Deterministic query execution (790 lines of pure logic)
  └── dashboard/dashboardEngine.ts   Dashboard assembly and summary extraction

providers/
  ├── llmProvider.ts        Unified abstraction (routes to Groq or Ollama)
  ├── groq/groqProvider.ts  Groq cloud API client (OpenAI-compatible)
  └── ollama/ollamaProvider.ts  Ollama local API client

routes/
  ├── upload.ts             CSV upload + full processing pipeline
  ├── dashboard.ts          Dashboard/KPI/chart read endpoints
  └── ask.ts                AI question-answering endpoint
```

### Shared Packages

```
packages/
  ├── shared-types/         TypeScript interfaces used by both client and server
  │   └── index.ts          DashboardJSON, AIResponse, KPI, DetectedIntent, etc.
  └── shared-utils/         Formatting, math, and helper functions
      └── index.ts          formatTitle, classNames, formatDate, etc.
```

---

## 3. Data Flow

### Upload → Dashboard

```
User drops CSV
  → PapaParse streams rows
  → metadataEngine detects column types (date, numeric, categorical)
  → statisticsEngine computes per-column stats (mean, median, std, outliers)
  → businessEngine generates:
      - KPI cards (top numeric columns with trends)
      - Charts (auto-selected by data shape: time→line, category→bar, etc.)
      - Insights (anomalies, trends, top/bottom performers)
  → DashboardJSON stored in-memory
  → Client receives full dashboard, renders via Zustand store
```

### Question → Answer

```
User types: "Why is profit decreasing?"
  → intentEngine.classifyLevel() → "explain"
  → intentEngine.classifyType() → "cause_analysis"
  → queryEngine.executeQuery() → deterministic root-cause analysis
      - Aggregates by relevant dimensions
      - Computes trend direction and magnitude
      - Identifies contributing factors
  → Returns structured ExplainResult (causes, explanation, recommendations)
  → LLM optionally rewrites answer in natural language
  → Client displays in AnalysisPanel with contextual UI
  → User can "Pin to Dashboard" to make it permanent
```

### Key Insight: Deterministic Core, LLM Enhancement

The system is designed so that **the Node.js engine does the actual work** — the LLM only natural-language-ifies the result. This means:

- Works offline (falls back to deterministic answers when LLM is unavailable)
- Always accurate (LLM can't hallucinate data it doesn't have)
- Fast (deterministic execution in <50ms vs LLM's 1-3s)
- The LLM is optional, not required

---

## 4. State Management

### Zustand Store (Single Store, Slice Selectors)

```typescript
interface AppState {
  // Data
  datasetId: string | null;
  metadata: DatasetMetadata | null;
  dashboard: DashboardJSON | null;

  // UI State
  chatOpen: boolean;
  chatMessages: ChatMessage[];
  analysis: AnalysisResult | null;
  isUploading: boolean;
  uploadProgress: number;

  // Transient State
  highlightedChartId: string | null;
  newlyAddedChartId: string | null;
  pendingQuestion: string | null;

  // Actions
  setDataset, updateDashboard, addChatMessage, setAnalysis,
  pinAnalysisToDashboard, clearChat, reset, etc.
}
```

**Why Zustand over Redux/Context:**
- No providers/wrappers needed
- Selectors prevent unnecessary re-renders (each component subscribes only to the slices it uses)
- Simple API — no actions/reducers/thunks boilerplate
- Perfect for this app's state complexity (moderate, not extreme)

### React Query (Server State)

- `useUploadCSV()` — mutation for file upload
- `useAskQuestion()` — mutation for AI questions
- `useSummary()` — query for executive summary (cached, refetch on stale)

---

## 5. Performance Architecture

### Code Splitting (Vite + React.lazy)

| Chunk | Size (gzip) | When Loaded |
|---|---|---|
| `index.js` (initial) | ~60KB | Immediately |
| `vendor.js` | ~17KB | Immediately |
| `LandingPage.js` | ~19KB | Immediately |
| `DashboardPage.js` | ~47KB | On first upload |
| `plotly.js` | ~1,480KB | On first upload (lazy) |
| `pdf.js` | ~192KB | On PDF export (lazy) |

### Rendering Optimizations

- `React.memo` on ChartRenderer, MetricCard, InsightList — prevents re-renders when props unchanged
- Zustand slice selectors — each component subscribes only to its state slice
- Plotly `config.staticPlot` for non-interactive charts
- Conditional Plotly imports (only load the chart types actually used)

---

## 6. Scalability Considerations

### Current Architecture (In-Memory)

- Dataset storage is in-memory (Map) — suitable for single-user, demo, and evaluation
- No database needed for the prototype
- Ollama/Groq calls are stateless — can scale horizontally

### Production Scaling Path

1. **Storage**: Replace in-memory Map with PostgreSQL/S3 for persistent datasets
2. **Compute**: Extract processing pipeline into a queue (BullMQ/Redis) for large CSVs
3. **LLM**: Groq already scales — just increase rate limits. For Ollama, deploy behind a load balancer
4. **Frontend**: Already deployed as static SPA on CDN (Vercel) — scales automatically
5. **Caching**: React Query already caches server responses — add Redis for cross-session caching

### Cost Considerations

| Component | Free Tier | Paid Scale |
|---|---|---|
| Frontend (Vercel) | 100GB bandwidth/mo | $20/mo |
| Backend (Railway) | $5 credit/mo | $5-20/mo |
| LLM (Groq) | 14,400 requests/day | Pay-per-token |
| LLM (Ollama) | Free (self-hosted) | GPU server costs |

---

## 7. Design Decisions

### Why Deterministic Core + LLM Enhancement?

Most AI BI tools let the LLM write SQL or generate charts directly. This is fragile — LLMs hallucinate data, produce inconsistent charts, and are slow. PulseBI's approach:

1. **Intent detection** is rule-based (regex + keyword matching) — fast and accurate
2. **Query execution** is deterministic (pure TypeScript aggregation) — always correct
3. **LLM only natural-language-ifies** the already-computed answer — enhances UX without risk

This means the app works offline, is always accurate, and the LLM is a UX enhancement rather than a correctness dependency.

### Why Plotly over Recharts/D3?

Plotly provides:
- Rich interactivity out of the box (hover, zoom, pan)
- Consistent, professional appearance
- Support for 6+ chart types with minimal configuration
- Static export capability for PDF generation
- React wrapper that handles updates efficiently

### Why Monorepo?

- `shared-types` ensures client and server never disagree on data shapes
- `shared-utils` eliminates code duplication (formatTitle, classNames)
- npm workspaces keeps dependency management simple
- Type safety across the entire stack

---

## 8. What I Would Build Next (With Another Week)

1. **Persistent Storage** — PostgreSQL + S3 for datasets and dashboards
2. **Authentication** — User accounts, saved dashboards, sharing
3. **Real-time Collaboration** — WebSocket-based multi-user dashboard viewing
4. **Custom Charts** — Let users specify x/y axes, chart types manually
5. **Scheduled Reports** — Email PDF summaries on a schedule
6. **Data Connectors** — Direct connection to databases, APIs, Google Sheets
7. **Advanced Analytics** — Regression, forecasting, anomaly detection with scikit-learn
8. **Mobile Responsive** — Optimize dashboard layout for mobile devices
9. **Accessibility** — WCAG 2.1 AA compliance, keyboard navigation
10. **Multi-tenant** — Organization-level data isolation

---

## 9. AI Tools Used

| Tool | How Used |
|---|---|
| **OpenCode** | Primary development assistant — code generation, debugging, architecture decisions, refactoring |
| **GitHub Copilot** | Inline code completion during active coding |
| **Groq** | Cloud LLM for conversational analytics (free tier: llama3-70b-8192) |

### Why These Tools

- **OpenCode** was used for architecture planning, engine implementation, and the full processing pipeline. It excels at generating complex, interconnected systems.
- **GitHub Copilot** handled routine code completion — component props, TypeScript interfaces, utility functions.
- **Groq** provides a free, fast LLM API that's perfect for the natural-language enhancement layer. It's OpenAI-compatible, making integration straightforward.
