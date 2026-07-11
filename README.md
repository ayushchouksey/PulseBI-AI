# PulseBI AI

AI-powered business intelligence dashboard that transforms CSV data into interactive visualizations, actionable insights, and conversational analytics — all powered by a local LLM via Ollama.

## What It Does

Upload a CSV file and PulseBI instantly generates:

- **KPI cards** with key metrics and trend indicators
- **Interactive charts** (bar, line, pie, scatter, histogram) auto-selected based on your data
- **Business insights** — outliers, trends, and anomalies surfaced automatically
- **Executive summaries** with a natural language overview of your dataset

Then ask questions in natural language:

| Question Type | Example | What Happens |
|---|---|---|
| Information | "What is my total revenue?" | Returns a direct answer |
| Analysis | "Compare Electronics and Furniture" | Generates a comparison chart + insights |
| Explanation | "Why is profit decreasing?" | Root cause analysis with causes |
| Recommendation | "What should I focus on this week?" | Prioritized action items |
| Executive Brief | "Give me today's executive briefing" | Metrics, risks, opportunities |
| Decision Support | "Should I invest more in Electronics?" | Verdict with confidence + factors |
| Highlight | "Which region performs best?" | Highlights the relevant chart |
| Dashboard Modification | "Add Customer KPI to my dashboard" | Adds a new chart to the dashboard |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Zustand, React Query |
| Charting | Plotly.js |
| PDF Export | html2canvas-pro + jsPDF |
| Backend | Node.js, Express, TypeScript |
| Data Processing | PapaParse, Arquero-style aggregation |
| LLM | Ollama (llama3.2 by default) |
| Monorepo | npm workspaces |

## Project Structure

```
pulsebi-ai/
├── apps/
│   ├── client/          # React SPA (Vite)
│   │   └── src/
│   │       ├── components/ui/    # Reusable UI primitives
│   │       ├── features/
│   │       │   ├── chat/         # AI chat panel
│   │       │   └── dashboard/    # Dashboard, charts, analysis
│   │       ├── hooks/            # React Query hooks
│   │       ├── pages/            # Route pages
│   │       ├── services/         # API client
│   │       ├── stores/           # Zustand state
│   │       └── utils/            # PDF export helpers
│   └── server/          # Express API
│       └── src/
│           ├── engines/
│           │   ├── ingestion/    # CSV parsing
│           │   ├── metadata/     # Column type detection
│           │   ├── statistics/   # Statistical analysis
│           │   ├── business/     # KPI/chart/insight generation
│           │   ├── intent/       # LLM intent classification
│           │   ├── prompt/       # Prompt construction
│           │   ├── query/        # NL query execution engine
│           │   └── dashboard/    # Dashboard assembly
│           ├── providers/        # Ollama LLM provider
│           ├── routes/           # Express route handlers
│           └── utils/            # Logger
└── packages/
    ├── shared-types/    # TypeScript interfaces shared across client/server
    └── shared-utils/    # Formatting, math, and helper utilities
```

## Prerequisites

- **Node.js** >= 18
- **Ollama** installed and running — [ollama.com](https://ollama.com)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Pull the LLM model

```bash
ollama pull llama3.2
```

### 3. Configure environment (optional)

The server reads `apps/server/.env`:

```env
PORT=3001
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
LOG_LEVEL=info
```

## Running

### Development (recommended)

Starts both client and server with hot-reload:

```bash
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:3001
- The Vite dev server proxies `/api` requests to the backend automatically.

### Production build

```bash
npm run build
npm run start
```

### Individual services

```bash
# Client only
npm run dev -w apps/client

# Server only
npm run dev -w apps/server
```

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start client + server in development mode |
| `npm run build` | Build client and server for production |
| `npm run start` | Start the production server |
| `npm run typecheck` | Type-check all packages |
| `npm run lint` | Lint all packages |

## How It Works

1. **Upload** — You drop a CSV file. The server parses it, detects column types (date, numeric, categorical), computes statistics, and generates an initial dashboard with KPIs, charts, and insights.

2. **Explore** — The dashboard renders interactively. Charts are auto-selected based on data shape (time series get line charts, categories get bar/pie, etc.).

3. **Ask** — You type a question. The intent engine classifies it (information, analysis, recommendation, etc.), the query engine executes it against your data, and the LLM generates a structured response with optional charts, insights, or dashboard modifications.

4. **Iterate** — Pin AI-generated charts to your dashboard, export anything as PDF, or ask follow-up questions. The chat maintains full context.
