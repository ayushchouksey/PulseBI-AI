# PulseBI — Design Write-Up

## Analysis: What I Found and What I Decided to Act On

### The Problem
Business users upload CSVs and need answers — not dashboards they have to build themselves. Most BI tools (Tableau, PowerBI) require training. Most AI BI tools (Julius, ChatBI) let the LLM write SQL, which is fragile and hallucination-prone.

### What I Decided to Act On
I chose to build a **deterministic core with LLM enhancement** rather than an LLM-dependent system. The key insight: the Node.js engine does the actual data processing (aggregation, statistics, intent classification), and the LLM only natural-language-ifies the result. This means:

- **Always accurate** — LLM can't hallucinate data it doesn't have
- **Works offline** — falls back to deterministic answers when LLM is unavailable
- **Fast** — deterministic execution in <50ms vs LLM's 1-3s
- **Scalable** — the LLM is optional, not required

---

## Design Decisions: What I Built and Why

### 1. Intent-Based Architecture (Not Free-Form LLM)
Instead of letting the LLM decide what to do, I built an 8-level intent classification system:

| Intent Level | What Happens |
|---|---|
| `information` | Direct answer from data (sum, avg, count) |
| `analysis` | Comparison chart + insights + recommendations |
| `recommendation` | Prioritized action items with urgency |
| `executive_brief` | Metrics, risks, opportunities summary |
| `decision_support` | Verdict (yes/no/conditional) with confidence |
| `highlight` | Points to relevant existing chart |
| `explain` | Root cause analysis with contributing factors |
| `dashboard_modification` | Adds new charts/KPIs to the dashboard |

This gives the LLM a structured, predictable interface rather than hoping it generates correct SQL.

### 2. Plotly for Charting
Chose Plotly over Recharts/D3 because:
- Rich interactivity out of the box (hover, zoom, pan)
- Professional appearance without custom styling
- 6+ chart types with minimal configuration
- React wrapper handles updates efficiently
- Static export for PDF generation

### 3. Zustand Over Redux/Context
- No providers/wrappers needed
- Slice selectors prevent unnecessary re-renders
- Simple API — no actions/reducers/thunks boilerplate
- Perfect for this app's state complexity

### 4. Monorepo with Shared Types
- `shared-types` ensures client and server never disagree on data shapes
- `shared-utils` eliminates code duplication
- Type safety across the entire stack
- npm workspaces keeps dependency management simple

### 5. Code Splitting and Performance
- Plotly (4.8MB) lazy-loaded only when dashboard opens
- PDF libs (841KB) lazy-loaded only on export
- `React.memo` on heavy components (ChartRenderer, MetricCard)
- Zustand slice selectors prevent re-render cascades
- Initial bundle: ~250KB (down from ~3.5MB)

### 6. LLM Provider Abstraction
- Unified `llmProvider.ts` routes to either Groq (cloud) or Ollama (local)
- Same interface, same prompts, same JSON extraction logic
- Switching providers is a single env var change
- Groq free tier: 14,400 requests/day, llama3-70b-8192

---

## What I Would Build Next (With Another Week)

### Week 1 Priorities
1. **Persistent Storage** — PostgreSQL + S3 for datasets and dashboards (currently in-memory)
2. **User Authentication** — Login, saved dashboards, sharing via link
3. **Data Connectors** — Direct connection to databases, APIs, Google Sheets

### Week 2 Priorities
4. **Custom Chart Builder** — Let users specify x/y axes, chart types manually
5. **Scheduled Reports** — Email PDF summaries on a schedule
6. **Real-time Collaboration** — WebSocket-based multi-user dashboard viewing

### Week 3 Priorities
7. **Advanced Analytics** — Regression, forecasting, anomaly detection
8. **Mobile Responsive** — Optimize dashboard layout for mobile devices
9. **Accessibility** — WCAG 2.1 AA compliance, keyboard navigation
10. **Multi-tenant** — Organization-level data isolation

---

## AI Tools Used

### Primary Development: OpenCode
- Architecture planning and system design
- Engine implementation (intent, query, business, statistics)
- Full processing pipeline (CSV → KPIs → Charts → Insights)
- Code splitting, performance optimization, refactoring
- Debugging and error resolution

### Code Completion: GitHub Copilot
- Inline code completion during active coding
- TypeScript interface generation
- Utility function implementation

### LLM Provider: Groq
- Cloud LLM for conversational analytics
- Free tier: llama3-70b-8192 (14,400 requests/day)
- OpenAI-compatible API — straightforward integration

### Why These Tools
- **OpenCode** excels at generating complex, interconnected systems. It was used for the bulk of the implementation.
- **GitHub Copilot** handled routine code completion — component props, TypeScript interfaces, utility functions.
- **Groq** provides a free, fast LLM API. It's the natural choice for the natural-language enhancement layer.

---

## Evaluation Criteria Alignment

### UX Thinking
- Drag-and-drop CSV upload with progress indicator
- Contextual UI that adapts to intent level (8 different panel types)
- Pin-to-Dashboard workflow for persisting AI-generated charts
- Suggested questions that guide new users

### Visual Craft
- Clean, consistent design system (brand-500 primary, surface-50 background)
- Proper visual hierarchy (KPIs → Charts → Insights → Chat)
- Responsive layout that works on different screen sizes
- Intuitive navigation (upload → dashboard → chat → analysis)

### Architecture
- Deterministic core with LLM enhancement (not LLM-dependent)
- Shared types across client/server (type safety)
- Code splitting and performance optimization
- Provider abstraction for LLM flexibility

### Scope Judgment
- Shipped a complete, polished product in one week
- 8 intent levels, 6 chart types, PDF export, chat history
- No half-finished features — everything works end-to-end

### AI Fluency
- Used OpenCode for architecture, implementation, and optimization
- Used GitHub Copilot for code completion
- Used Groq for the LLM provider
- Demonstrated understanding of when to use AI vs deterministic logic
