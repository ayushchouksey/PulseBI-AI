# 🚀 PulseBI AI

> **An AI-powered Business Intelligence dashboard designed for non-technical business users.**

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-5-green)
![Plotly](https://img.shields.io/badge/Charts-Plotly-orange)
![Ollama](https://img.shields.io/badge/LLM-Ollama-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📌 Overview

Traditional BI tools are extremely powerful, but they often require users to understand concepts like:

- Measures
- Dimensions
- Aggregations
- Chart selection
- Dashboard configuration

PulseBI AI removes that complexity.

Instead of building dashboards manually, users simply:

1. Upload a CSV file
2. Confirm automatically detected metadata
3. Receive a fully generated dashboard
4. Ask questions in natural language
5. Generate additional charts through conversation

---

## ✨ Why PulseBI AI?

PulseBI AI is designed specifically for **business users**, not analysts.

Key principles:

- 📊 Dashboard first
- 🤖 AI explains insights
- 🧠 Backend computes statistics
- 🎯 Zero SQL
- 🚫 Zero coding
- 📁 Upload → Insights in minutes

---

## 🎯 Assignment Goals

This project was built for a Product Interface Engineer take-home assignment.

Evaluation Criteria | How PulseBI AI Addresses It
--- | ---
UX Thinking | Removes BI complexity through guided metadata confirmation and AI-driven interactions.
Visual Craft | Modern dashboard inspired by leading SaaS products with an original design language.
Architecture | Modular engine-based backend with configuration-driven frontend.
Scope Judgment | Focuses on one polished workflow instead of many unfinished features.
AI Fluency | Uses a local LLM through Ollama with provider abstraction for future extensibility.

---

## 🖥️ Core Features

- CSV upload
- Automatic metadata detection
- Metadata confirmation
- Dashboard generation
- KPI cards
- Interactive Plotly charts
- Download chart (PNG/SVG)
- Download tables (CSV/Excel)
- Natural language dashboard queries
- AI-generated business summaries
- Dashboard updates through conversation
- Responsive layout

---

## 🏗️ System Architecture

> The backend performs all business calculations.

> The frontend focuses on rendering.

> The LLM interprets statistics rather than calculating them.

See:

- `docs/22_Architecture_Diagram.md`

---

## 🧠 AI Workflow

```text
Upload CSV
    ↓
Metadata Detection
    ↓
Statistics Engine
    ↓
Dashboard Generation
    ↓
User Question
    ↓
Intent Detection
    ↓
LLM
    ↓
Structured Dashboard Action
    ↓
Dashboard Update
```

---

## 📂 Project Structure

```text
pulsebi-ai/
│
├── apps/
│   ├── client/
│   └── server/
│
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   └── shared-config/
│
├── docs/
├── sample-data/
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Zustand
- TanStack Query
- Plotly
- React Grid Layout
- Framer Motion

### Backend

- Node.js
- Express
- TypeScript
- Multer
- PapaParse
- Arquero
- Zod
- Pino

### AI

- Ollama
- Local LLM (Llama 3.2 / Mistral / Gemma)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- Git
- Ollama

---

### Clone

```bash
git clone <repository-url>
cd pulsebi-ai
```

---

### Install

```bash
npm install
```

Install workspace dependencies:

```bash
npm install --workspaces
```

---

### Start Ollama

Example:

```bash
ollama pull llama3.2
ollama serve
```

---

### Start Backend

```bash
cd apps/server
npm run dev
```

---

### Start Frontend

```bash
cd apps/client
npm run dev
```

---

Open:

http://localhost:5173

---

## 📈 Example Workflow

1. Upload Retail.csv

2. Confirm metadata

3. Generate dashboard

4. Ask:

> "Show revenue by region"

5. Ask:

> "Create a pie chart for categories"

6. Export dashboard

---

## 📁 Sample Data

Included sample datasets:

- Retail.csv
- Sales.csv
- Finance.csv
- Healthcare.csv
- Employee.csv

---

## 🤖 AI Usage

AI was used to accelerate development by assisting with:

- Architecture exploration
- Documentation
- Component scaffolding
- Prompt engineering
- Refactoring ideas

All engineering decisions, product trade-offs, and final implementation were reviewed and directed by the developer.

---

## 🛣️ Future Roadmap

- Saved dashboards
- Authentication
- Multi-dataset support
- Dashboard templates
- Forecasting
- Voice queries
- Real-time dashboards
- Dark mode

---

## 📄 Documentation

See the `docs/` directory for:

- Product decisions
- Architecture
- Data models
- Engine specifications
- UI design system
- API design
- Engineering standards

---

## 📜 License

MIT

---

## 🙌 Acknowledgements

Inspired by the usability goals of modern BI platforms while pursuing a simpler, AI-assisted experience for business users.