# InsightFlow AI

Version: 1.0

---

# Product Vision

InsightFlow AI is an AI-powered Business Intelligence platform designed specifically for non-technical business users.

Unlike traditional BI tools that require SQL knowledge, predefined reports, or complex dashboard builders, InsightFlow AI allows users to upload business data, automatically generate dashboards, and interact with their data using natural language.

The goal is to make business analytics as simple as having a conversation.

---

# Problem Statement

Existing BI platforms such as Looker, Power BI, Tableau, and Metabase provide extensive functionality but are primarily designed for analysts rather than everyday business users.

Business users often struggle with:

- SQL
- Dataset modeling
- Dashboard configuration
- Choosing appropriate visualizations
- Understanding analytical terminology

As a result, they depend heavily on technical teams for simple business questions.

InsightFlow AI removes these barriers.

---

# Target Users

Primary Users

- Sales Managers
- Marketing Managers
- Finance Managers
- HR Managers
- Startup Founders
- Business Owners
- Operations Managers

These users should be able to analyze data without writing SQL or understanding BI concepts.

---

# Product Goals

The application should:

- Accept CSV files from users.
- Automatically understand the dataset.
- Generate dashboards without configuration.
- Explain business insights.
- Allow users to ask questions using natural language.
- Allow users to create new reports using conversational commands.
- Export reports and charts.

---

# Scope

The project includes:

✓ CSV Upload

✓ CSV Validation

✓ Metadata Detection

✓ Metadata Confirmation

✓ Statistics Engine

✓ Automatic Dashboard Generation

✓ KPI Cards

✓ Interactive Plotly Charts

✓ Data Table

✓ AI Business Summary

✓ Chat with Data

✓ Dynamic Chart Creation

✓ Dashboard Modification

✓ Report Export

✓ Responsive Design

---

# Out of Scope

The following features will NOT be implemented:

- Authentication
- User Management
- Database Connections
- Scheduled Reports
- Role Based Access
- Sharing Dashboards
- Cloud Deployment
- Multi Tenant Support

---

# Core Features

## 1. Smart CSV Upload

The system accepts CSV files.

The application validates:

- Empty files
- Invalid CSV
- Missing headers
- Duplicate columns
- Unsupported values

---

## 2. Metadata Engine

Automatically identifies

- Data Types
- Business Roles
- Metrics
- Dimensions
- Date Columns

Users may modify suggestions before dashboard generation.

---

## 3. Dashboard Generator

Automatically creates

- KPI Cards
- Revenue Trends
- Category Analysis
- Region Analysis
- Distribution Charts

No manual dashboard building required.

---

## 4. AI Business Summary

Generate human-readable business insights from statistics.

Example:

"Revenue increased by 18% compared to last month."

---

## 5. Chat with Data

Users may ask questions such as

"What was my revenue in January?"

"Which product generated the highest profit?"

"Compare Q1 and Q2."

---

## 6. Dynamic Report Generation

Users may request

"Create a pie chart of Revenue by Region."

The system creates the visualization automatically.

---

## 7. Dashboard Editing

Users may ask

"Replace this chart with a bar chart."

"Remove this visualization."

"Add Profit to this report."

The dashboard updates dynamically.

---

## 8. Export

Users may export

- Charts
- Tables
- Dashboard
- Reports

Supported formats

- PNG
- CSV
- Excel
- PDF

---

# Non Functional Requirements

The application should be

- Responsive
- Fast
- Accessible
- Modular
- Maintainable
- Scalable
- Type Safe
- Reusable

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Plotly
- Zustand
- TanStack Table
- React Query

Backend

- Node.js
- Express
- Multer
- PapaParse
- Zod

AI

- Ollama
- Llama 3.2

---

# High Level User Flow

Upload CSV

↓

Validate Data

↓

Generate Metadata

↓

User Confirmation

↓

Generate Statistics

↓

Generate Dashboard

↓

AI Summary

↓

Chat with Data

↓

Create Reports

↓

Export Reports

---

# Deliverables

The final solution should include

- Production-quality frontend
- Production-quality backend
- Responsive UI
- Sample CSV files
- Architecture documentation
- Installation guide
- GitHub-ready project structure

---

End of Document