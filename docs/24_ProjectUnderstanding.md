# Project Understanding Summary

Version: 1.0  
Source: Synthesis of docs/01–23  
Date: July 8, 2026

---

## Product Overview

**PulseBI AI** (also referred to as **InsightFlow AI** in `01_project_overview.md`) is an AI-powered Business Intelligence platform built for non-technical business users — sales, marketing, finance, and operations managers, startup founders, and business owners who know Excel but not SQL or traditional BI tools.

The core value proposition: upload a CSV, confirm how columns should be interpreted, receive an auto-generated dashboard immediately, then interact with data through natural language — without building dashboards manually or learning BI terminology.

**Guiding principles:**

- Backend computes; AI explains (never calculates numbers)
- Configuration drives rendering (no hardcoded dashboards)
- Automation over configuration; simplicity over flexibility
- Business language over technical jargon (Category, not Dimension)

**Explicitly out of scope for v1:** authentication, user management, database connections, scheduled reports, RBAC, sharing, cloud deployment, multi-tenancy.

---

## Application Architecture

### High-Level Topology

```
Browser (React + Vite)
        │
        │  REST API (Axios) — /api/v1
        ▼
Express Backend (Node.js + TypeScript)
        │
        ├── Data Ingestion Engine
        ├── Data Quality Engine
        ├── Business Intelligence Understanding Engine (BIUE)
        ├── Statistics Engine
        ├── Dashboard Orchestration Engine (DOE)
        ├── Natural Language Processing Layer
        ├── Export Engine
        └── AI Provider (Ollama → future: OpenAI, Gemini, Claude)
        │
        ▼
JSON responses → React components → Plotly charts
```

### Architectural Style

| Layer | Pattern | Key Rule |
|-------|---------|----------|
| Frontend | Feature-based modules, atomic design (atoms → pages) | No business logic in React components |
| Backend | Clean/module architecture: Routes → Controllers → Services → Engines | Stateless HTTP; session data in memory only |
| AI | Provider abstraction (`AIProvider` interface) | LLM receives metadata + statistics, never raw CSV |
| Data | Pipeline of independent engines | Each engine has a single responsibility and defined I/O contract |

### Monorepo Structure

```
pulsebi-ai/
├── apps/client/          # React frontend
├── apps/server/          # Express backend
├── packages/
│   ├── shared-types/     # Shared TypeScript models
│   ├── shared-utils/
│   └── shared-config/
├── docs/
├── sample-data/
└── scripts/
```

### Dataset Context (Backend Session State)

The backend maintains a temporary in-memory **Dataset Context** per session:

```json
{
  "dataset": {},
  "metadata": {},
  "statistics": {},
  "dashboard": {},
  "filters": {},
  "aiContext": {}
}
```

No module parses CSV independently. Uploaded files are deleted after processing; datasets are not persisted.

### Data Pipeline

```
CSV Upload → Validation → Parsing → Metadata (BIUE) → User Confirmation
    → Statistics → Dashboard JSON → Frontend Rendering
```

Parallel AI path:

```
User Question → Intent Classification → Context Builder → Prompt Builder
    → AI Provider → Response Validation → Dashboard Action → DOE Update → UI Refresh
```

### Technology Stack

| Tier | Technologies |
|------|-------------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Zustand, TanStack Query, React Router, Plotly.js, React Grid Layout, TanStack Table, Framer Motion, Axios |
| Backend | Node.js, Express, TypeScript, Multer, PapaParse, Arquero, Zod, Pino, UUID |
| AI | Ollama (Llama 3.2 default); provider-swappable |

### API Contract

- Base URL: `/api/v1`
- All endpoints return a standard envelope: `{ success, data, message, errors, requestId, timestamp }`
- Middleware: Request ID, logger, CORS, compression, security headers, validation, global error handler

---

## Backend Modules

### Layer Organization

| Layer | Responsibility |
|-------|----------------|
| **Routes** | Endpoint definitions; no business logic |
| **Controllers** | HTTP in/out, request validation, delegate to services |
| **Services** | Orchestrate engines, manage workflow, transform responses |
| **Engines** | Core deterministic business logic |
| **Providers** | External integrations (Ollama, future LLM providers) |
| **Validators** | Zod schemas for requests, files, env vars |
| **Middleware** | Logging, errors, security, CORS |

### Engines (Processing Pipeline)

#### 1. Data Ingestion Engine
- **Only module allowed to read raw uploaded files**
- Accepts CSV (.csv only in v1); 50 MB / 100K rows / 500 columns limits
- Parses headers, rows, delimiters (comma, semicolon, tab, pipe); UTF-8; quoted values
- Normalizes values (trim, empty → null); no type conversion
- Output: `Dataset` object with headers and rows → forwards to Validation

#### 2. Data Quality Engine
- Validates structure, headers, rows, columns, values
- Profiles dataset: missing values, duplicates, empty/constant/high-cardinality columns
- Outlier detection (warnings only); numeric, currency, date, boolean, text validation
- Produces quality score (0–100), warnings, errors, recommendations
- Fatal errors block processing; warnings do not
- Output: Validated dataset + Quality Report → Metadata Engine

#### 3. Business Intelligence Understanding Engine (BIUE)
- Transforms validated data into business knowledge (metadata)
- Column profiling → type detection → semantic detection → business role assignment
- Display name generation, aggregation recommendations, KPI detection
- Date hierarchy (year/quarter/month/week/day), geographic detection
- Relationship discovery, chart suitability scoring, filter suitability, business glossary
- Confidence scores (0–100); columns below 70 highlighted for user review
- Output: Metadata JSON (Core Data Models contract) → Statistics + Dashboard engines

#### 4. Statistics Engine
- **Only module allowed to perform mathematical calculations**
- Computes: dataset summary, descriptive stats, KPIs, grouped aggregations, trends, rankings, growth, distributions
- Uses Arquero for aggregation/grouping/filtering/sorting
- Generates dashboard-ready datasets and compact AI context (no raw CSV to LLM)
- Target: <3 seconds for 100K rows
- Output: Statistics JSON + Dashboard Data + AI Context

#### 5. Dashboard Orchestration Engine (DOE)
- Converts metadata + statistics into interactive dashboard configuration
- Default dashboard: KPI cards (max 4), trend chart, category/regional comparison, distribution, top-N table, AI summary, chat panel
- Chart type selection rules (e.g., Date+Metric → Line; Category+Metric → Bar)
- Generates Plotly configs, filters, layout (React Grid Layout positions)
- Handles AI dashboard actions incrementally (no full regeneration)
- Duplicate prevention; session-only personalization
- Output: Dashboard JSON → Frontend

#### 6. Natural Language Processing Layer
- Intent classification (answer question, generate/modify/delete chart, filter, compare, export, etc.)
- Context builder (metadata, statistics, dashboard, filters, conversation — never raw CSV)
- Prompt builder, AI provider dispatch, response validation, action generation
- Hallucination prevention: reject fabricated numbers, invalid actions, unsupported charts
- Session-only conversation memory
- Output: AI Response with structured `DashboardAction[]` → DOE

#### 7. Export Engine
- Formats: PNG, SVG, PDF, CSV, Excel
- Targets: individual charts, full dashboard, filtered dataset, data table, AI summary

### HTTP API Modules (Controllers/Services)

| Module | Key Endpoints |
|--------|--------------|
| **Upload** | `POST /upload` (multipart CSV) |
| **Metadata** | `GET /metadata/{datasetId}`, `PUT /metadata/{datasetId}` |
| **Statistics** | `GET /statistics/{datasetId}` |
| **Dashboard** | `POST /dashboard/generate`, `GET/PUT /dashboard/{id}`, widget CRUD |
| **AI** | `POST /ai/query`, `POST /ai/summary`, `POST /ai/recommendations` |
| **Export** | `POST /export/dashboard`, `/export/chart`, `/export/table` |
| **Session** | `POST/GET/DELETE /session/{id}` |
| **Config** | `GET /config` |
| **Health** | `GET /health` |

### Supported Dashboard Actions (AI → DOE)

`CREATE_CHART`, `UPDATE_CHART`, `DELETE_CHART`, `ADD_KPI`, `REMOVE_KPI`, `APPLY_FILTER`, `CLEAR_FILTER`, `SORT_TABLE`, `EXPORT`, `RESET_DASHBOARD`, `ANSWER`, `RESIZE_WIDGET`, `MOVE_WIDGET`, `REMOVE_WIDGET`

---

## Frontend Modules

### Organization

Feature-based modules under `apps/client/src/modules/`, each containing `components/`, `hooks/`, `services/`, `store/`, `types/`, `utils/`, `index.ts`.

Shared reusable UI lives in `components/` (atoms, molecules, organisms, templates).

### Feature Modules

| Module | Purpose | Key Components |
|--------|---------|----------------|
| **Upload** | CSV upload lifecycle | `UploadZone`, `UploadCard` |
| **Metadata** | Review/edit detected columns | `MetadataTable` (full-screen modal) |
| **Dashboard** | Configuration-driven dashboard | `DashboardGrid`, `KpiSection`, `ChartCard`, `FilterBar`, `DataTable`, `TopNavigation` |
| **Charts** | Plotly rendering | `ChartCard` (accepts Plotly config from backend) |
| **Chat** | Natural language interaction | `ChatPanel`, `GlobalSearchBar` |
| **Filters** | Global dashboard filtering | `FilterBar`, `FilterDropdown` |
| **Tables** | Raw data display | `DataTable` (virtual scrolling, TanStack Table) |
| **Export** | One-click exports | `ExportMenu` |
| **Settings** | Theme, config (future route) | — |

### Pages & Routing

| Route | Page | Layout |
|-------|------|--------|
| `/` | Landing Page (upload) | Public |
| `/dashboard` | Dashboard (post-metadata) | Dashboard |
| `/settings` | Settings (future) | — |
| `*` | 404 | — |

Note: Metadata confirmation is described as a full-screen modal (`MetadataPage`) rather than a separate route in some docs.

### State Management

| Store | Domain | Server State (TanStack Query) |
|-------|--------|------------------------------|
| `uploadStore` | File selection, progress, datasetId | — |
| `metadataStore` | Detected metadata, user overrides | Metadata cache |
| `dashboardStore` | Dashboard JSON, widgets, layout | Dashboard cache |
| `filterStore` | Active filters, date range | — |
| `chatStore` | Messages, conversationId, suggestions | AI responses cache |
| `sessionStore` | datasetId, sessionId, dashboardId | — |
| `uiStore` | Modals, sidebar, toasts, loading overlay | — |
| `themeStore` / config | Theme, limits, supported charts | Configuration cache |

**Rules:** Stores never call each other directly; communication via services, hooks, and API responses. Backend is source of truth for business data. No statistics or CSV persisted client-side.

### Component Hierarchy (Atomic Design)

```
Pages → Templates → Organisms → Molecules → Atoms

Examples:
  LandingPage → LandingTemplate → UploadZone → Button, Input, Spinner
  DashboardPage → DashboardTemplate → DashboardGrid → ChartCard → Plotly
```

### Frontend Constraints

- Renders exclusively from Dashboard JSON / Plotly configs supplied by backend
- Lazy-loads routes and Plotly; memoizes widgets; virtualizes large tables
- Error boundaries at global, widget, and chart levels
- Design system: Looker-inspired, Inter font, 8px grid, primary blue `#2563EB`, WCAG AA

---

## User Flow

### End-to-End Journey

```
Landing Page
    ↓  Upload CSV (drag-drop or browse)
Validate & Parse (<2s)
    ↓
Metadata Confirmation (full-screen modal)
    ↓  Review/edit columns: type, business role, aggregation, visibility
    ↓  Confirm → Generate Dashboard
Statistics + Dashboard Generation (<5s)
    ↓
Interactive Dashboard
    ├── KPI cards (auto-selected: Revenue, Profit, Orders, etc.)
    ├── Charts (trend, category, region, distribution)
    ├── Global filters (date, category, region, product)
    ├── Data table (sort, filter, paginate, export)
    ├── AI business summary
    └── Chat / global search panel
    ↓
Natural Language Interaction
    ├── Ask questions ("What was revenue in January?")
    ├── Create charts ("Show revenue by region as a pie chart")
    ├── Modify dashboard ("Replace with bar chart", "Remove this chart")
    ├── Apply filters ("Filter only West region")
    └── Export ("Export dashboard as PDF")
    ↓
Export (one-click: PNG, SVG, PDF, CSV, Excel)
```

### Screen-by-Screen

**1. Landing Page**
- Drag-and-drop or browse CSV; view progress; replace/cancel upload
- Validation rejects: empty, unsupported format, corrupted, no headers, duplicate columns, oversized files
- On success → auto-advance to metadata detection
- Optional: sample datasets, help section

**2. Metadata Confirmation**
- Full-screen modal with scrollable table of all columns
- Shows: original name, detected type, business role, display name, aggregation, visibility, confidence, preview values
- User can edit, search, reset, or cancel
- Low-confidence columns (<70) highlighted
- "Generate Dashboard" confirms and proceeds

**3. Dashboard**
- Top nav: logo, dataset name, upload new, export, theme, settings
- Global search bar: natural language queries with suggested prompts
- KPI section → chart grid → data table
- Chat panel (right on desktop, bottom sheet on mobile)
- All filters update every visualization simultaneously
- Chart actions: download, fullscreen, refresh, delete, duplicate, edit, pin, move, resize
- AI commands update dashboard live without page refresh

### Success Criteria (First-Time User)

Within ~5 minutes, without documentation:

1. Upload CSV  
2. Confirm metadata  
3. Receive meaningful dashboard  
4. Ask a question  
5. Generate a new chart  
6. Export a report  

### Performance Targets

| Operation | Target |
|-----------|--------|
| CSV validation | <2s |
| Metadata detection | <2s |
| Statistics | <2–3s |
| Dashboard generation | <5s |
| AI summary | <5s |
| Widget update (post-AI) | <500ms |
| Chart rendering | Instant after data prep |

Supports datasets up to 100,000 rows without UI freeze.

---

## Missing Information

The documentation is comprehensive for product vision and architecture but has gaps and inconsistencies that would need resolution during implementation.

### Naming & Branding Inconsistencies

| Issue | Details |
|-------|---------|
| Product name | `01_project_overview.md` uses **InsightFlow AI**; all other docs use **PulseBI AI** |
| File naming | `04_Product_Requirements.md` vs header "04_Functional_Requirements"; `10_Business_Insight_Engine.md` vs header "10_Statistics_Engine"; `12_AI_Intent_Engine.md` vs header "12_Natural_Language_Processing_Layer" |
| Business roles | Functional requirements list Metric/Category/Date/Identifier/Text/Ignore; Core Data Models add dimension, location, category as separate roles |
| Directory Structure | `05_System_Architecture.md` specifies `src/features/`, `src/shared/`, and `src/store/`, whereas `14_Frontend_Architecture.md` and `19_Project_Folder_Structure.md` specify `src/modules/`, `src/components/`, and `src/stores/` |
| Ollama Config | `15_Backend_Architecture.md` specifies `OLLAMA_BASE_URL`, whereas `26_Backend_Execution_Guide.md` specifies `OLLAMA_URL` |

### Underspecified Implementation Details

| Area | Gap |
|------|-----|
| **Export Engine** | Referenced throughout but no dedicated engine spec document (unlike other engines) |
| **Filter re-computation** | Docs say filters update all visualizations and flow through backend, but no detailed API or engine spec for server-side filter application |
| **Session persistence** | Session API exists; unclear TTL, eviction policy, multi-tab behavior, or recovery after server restart |
| **Intent classification** | NLP layer describes intents but not whether classification is rule-based, LLM-based, or hybrid |
| **Metadata → Statistics trigger** | Unclear if statistics are computed automatically after metadata confirmation or on explicit API call |
| **Dashboard ID lifecycle** | Relationship between `datasetId`, `dashboardId`, and session IDs across the flow |
| **Plotly config schema** | Widget model references `plotlyConfig` and `configuration` but no detailed schema for chart configs |
| **Dashboard action parameters** | Action types listed but parameter shapes per action type not fully specified |
| **Quality report UI** | Data Quality Engine produces a report "shown before Metadata Confirmation" but no UI spec for displaying it |
| **Global search vs chat panel** | Both accept NL queries; relationship and deduplication between the two entry points unclear |
| **Material UI vs custom** | Frontend architecture mentions "Material UI (or custom design system)"; design system doc implies custom/Tailwind — no final decision |

### Missing Operational Documentation

| Document | Status |
|----------|--------|
| Installation guide | Referenced in deliverables and GitHub README but no standalone `docs/` install doc |
| Environment variable reference | Partial list in backend architecture; no complete `.env.example` spec in docs |
| Error code catalog | Partial (DQ001–DQ008, CSV_001); not exhaustive across all modules |
| Testing strategy | Marked "future" throughout; no test plans, coverage targets, or fixture definitions |
| CI/CD | GitHub Actions marked future; no pipeline spec |
| Deployment guide | Mentions Docker/Railway/Render/Fly.io but no step-by-step deployment doc |
| API authentication | Explicitly out of scope, but rate limiting also marked future with no interim abuse prevention |

### Data Model Gaps

| Gap | Details |
|-----|---------|
| **Conversation message schema** | Conversation context referenced but individual message structure not defined |
| **Layout model** | Dashboard `layout: {}` is placeholder; React Grid Layout integration details unspecified |
| **Trend/ranking value shapes** | Trend model has empty `values[]`; no element schema |
| **Widget dataSource enum** | Values like `"trend"` referenced but full list not documented |
| **Statistics response shape** | Statistics JSON referenced but no complete top-level schema (unlike individual sub-models) |

### Frontend Gaps

| Gap | Details |
|-----|---------|
| **Metadata route** | Some docs imply modal on landing flow; pages list includes separate `MetadataPage` — navigation pattern unresolved |
| **Settings page** | Route exists as future; no requirements |
| **Sample data integration** | Sample CSVs listed in folder structure but no spec for "Recent Sample Datasets" on landing page |
| **Dark mode** | Marked future; components require "dark mode compatibility" with no token definitions |
| **i18n** | Future; no string extraction strategy beyond "centralize strings" |

### AI / NLP Gaps

| Gap | Details |
|-----|---------|
| **Prompt templates** | Prompt builder rules described but no actual prompt templates or few-shot examples |
| **Fallback when Ollama unavailable** | Error handling described; no degraded-mode behavior (e.g., dashboard without AI summary) |
| **Intent → action mapping** | High-level mapping exists; edge cases (ambiguous chart references, "this chart") not specified |
| **Token/context limits** | No guidance on truncating statistics context for large datasets |

### Security & Compliance Gaps

| Gap | Details |
|-----|---------|
| **PII handling** | Marked future in Data Quality Engine |
| **CORS configuration** | Mentioned but origins/methods not specified |
| **File retention** | "Deleted after processing" — timing and cleanup mechanism not detailed |

### Scope Ambiguities

| Feature | Ambiguity |
|---------|-----------|
| **Correlation analysis** | Marked optional in Statistics Engine — in or out of v1? |
| **Chart types** | Many listed (heatmap, treemap, waterfall, gauge, box plot); no priority tier for MVP |
| **Bulk metadata edit** | Mentioned in UI design system; not in functional requirements |
| **Widget drag/resize** | Dashboard grid supports it; unclear if user-initiated or AI-only in v1 |
| **Upload during dashboard** | "Upload another dataset at any time" — full flow reset behavior unspecified |

---

## Execution Roadmap & Checklist

### High-Level Execution Sequence (Milestones M1–M17)
PulseBI AI development follows 17 strict vertical milestones defined in [25_Execution_Roadmap.md](file:///Users/ayush/project/BI%20Dashboard/PulseBI-AI/docs/25_Execution_Roadmap.md):
- **Infrastructure (M1–M4)**: Repository workspaces, backend and frontend framework foundations, shared types and utility packages.
- **Ingestion & Metadata (M5–M7)**: CSV upload API, data validation/parsing, metadata extraction engine, and confirmation UI.
- **Analytics & Orchestration (M8–M10)**: deterministic Statistics Engine, Dashboard Orchestration Engine, and Plotly-based grid layouts.
- **Conversational Intelligence (M11–M12)**: Ollama integration, context builders, NLP intent classification, and chat panel widget action triggers.
- **Exports & Optimizations (M13–M14)**: Multiformat Export Engine (PDF, PNG, SVG, CSV, Excel) and client rendering optimizations (lazy-loading, table virtualization).
- **Validation & Release (M15–M17)**: Error/empty/loading states validation, documentation synchronizing, and final repository packaging.

### Backend Execution Path (Milestones B1–B16)
The backend infrastructure is built in 16 incremental milestones defined in [26_Backend_Execution_Guide.md](file:///Users/ayush/project/BI%20Dashboard/PulseBI-AI/docs/26_Backend_Execution_Guide.md):
- **Workspaces & Environment (B1–B2)**: Package definitions, TypeScript compiler config, and Zod env schema validation (PORT, NODE_ENV, LOG_LEVEL, OLLAMA_URL, OLLAMA_MODEL, limits).
- **Architecture Layers & Utilities (B3–B8)**: Shared constants, domain type interfaces, request/response models, custom logger, request ID generation, error handler, and Zod validators.
- **Engines, Providers & Services (B9–B13)**: Ollama provider wrappers, mock-only engine stubs (DataIngestion, DataQuality, Metadata, Statistics, Dashboard, NLP, Export), orchestrating services, and standard REST route endpoints under `/api/v1`.
- **Boots & Verification (B14–B16)**: Bootstrap app setup and health/configuration status endpoint implementations (`GET /health`, `GET /config`).

### Frontend Execution Path (Milestones F1–F21)
The frontend UI is built in 21 incremental milestones defined in [27_Frontend_Execution_Guide.md](file:///Users/ayush/project/BI%20Dashboard/PulseBI-AI/docs/27_Frontend_Execution_Guide.md):
- **Boilerplate & Theme (F1–F4)**: React 19 setup, global spacing/radius/color design tokens, layout templates, and routes configuration.
- **State & Client API (F5–F7)**: Zustand stores (Upload, Metadata, Dashboard, Filter, Chat, UI), Axios client interceptors, and reusable shared components (dialogs, tables, skeletons).
- **Ingestion & Grid UI (F8–F14)**: Drag & Drop upload cards, scrollable metadata modal, dashboard grids (React Grid Layout), KPI cards, Plotly charts integration, and dynamic data tables.
- **Conversational UI & Exports (F15–F21)**: Collapsible chat side-panel, live state rendering for AI-triggered actions, asset export handlers, responsive checks, and accessibility focus management.

### Quality Assurance & Release Gate
The release quality checklist outlined in [28_Development_Checklist.md](file:///Users/ayush/project/BI%20Dashboard/PulseBI-AI/docs/28_Development_Checklist.md) mandates:
- **E2E Integration Validation**: Successful execution of the full user flow (Upload CSV -> confirm metadata -> verify KPI/Chart widgets -> query via search/chat -> apply global filters -> export PDF/PNG/CSV).
- **Compliance Standards**: 0 console/TypeScript compilation/ESLint errors, keyboard-navigable UI elements, and WCAG AA contrast ratios.

---

## Summary

PulseBI AI is a well-architected, engine-pipeline BI product targeting business users who want spreadsheet-to-insights in minutes. The architecture cleanly separates ingestion, quality, semantic understanding, statistics, dashboard orchestration, and AI interpretation — with strict rules that deterministic backend code owns all numbers and the LLM only explains and issues structured dashboard actions.

The frontend is a thin, configuration-driven rendering layer organized by feature modules with Zustand + TanStack Query state management.

The primary documentation gaps are: product naming consistency, missing Export Engine spec, incomplete API/data model schemas for actions and statistics, unresolved UI flow details (quality report, metadata as modal vs page, search vs chat), and absence of operational docs (testing, deployment, env config). Resolving these before implementation would reduce ambiguity during build.

---

End of Document
