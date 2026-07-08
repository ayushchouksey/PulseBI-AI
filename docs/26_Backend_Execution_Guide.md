# 26_Backend_Execution_Guide

Version: 1.0

---

# Purpose

This document defines the exact implementation order for the backend.

The backend must be built incrementally.

Each milestone should contain one logical unit of work.

Do not combine milestones.

Do not implement future milestones early.

---

# Backend Development Principles

- Build infrastructure before features.
- Separate Controllers, Services, Engines, and Providers.
- Keep Controllers thin.
- Business logic belongs only in Engines.
- Services orchestrate Engines.
- Providers integrate with external systems.
- Every milestone must compile successfully.

---

# Milestone B1 — Workspace & Package Configuration

### Objective

Prepare the backend workspace.

### Deliverables

- apps/server/package.json
- tsconfig.json
- nodemon / tsx configuration
- scripts
- dependency installation

### Do NOT

- Create routes
- Create controllers
- Create business logic

### Acceptance Criteria

- npm install succeeds
- npm run dev starts without errors

---

# Milestone B2 — Environment Configuration

### Deliverables

- .env.example
- config/index.ts
- Environment validation using Zod

Variables:

- PORT
- NODE_ENV
- LOG_LEVEL
- OLLAMA_URL
- OLLAMA_MODEL
- MAX_UPLOAD_SIZE
- MAX_ROWS
- MAX_COLUMNS

### Acceptance Criteria

- Missing variables fail at startup
- Typed configuration object exported

---

# Milestone B3 — Constants

Create:

- api.constants.ts
- chart.constants.ts
- validation.constants.ts
- error.constants.ts
- app.constants.ts

No business logic.

---

# Milestone B4 — Shared Types

Create:

- api.types.ts
- request.types.ts
- response.types.ts
- dashboard.types.ts
- metadata.types.ts
- statistics.types.ts
- ai.types.ts

Interfaces only.

---

# Milestone B5 — Utilities

Create:

- logger.ts
- asyncHandler.ts
- responseBuilder.ts
- errorBuilder.ts
- date.util.ts
- file.util.ts
- uuid.util.ts

No feature implementation.

---

# Milestone B6 — Middleware

Create:

- requestId
- requestLogger
- validation
- errorHandler
- notFoundHandler
- cors
- helmet
- compression

Acceptance:

Middleware chain operational.

---

# Milestone B7 — Validators

Create validators for:

- Upload
- Metadata
- Dashboard
- AI Query
- Export

Use Zod.

No controller logic.

---

# Milestone B8 — Models

Create request/response models.

Example:

Requests

- UploadRequest
- MetadataRequest
- DashboardRequest
- AIQueryRequest

Responses

- UploadResponse
- DashboardResponse
- MetadataResponse
- StatisticsResponse
- ExportResponse

---

# Milestone B9 — Provider Layer

Create:

providers/

Files

- provider.interface.ts
- ollama.provider.ts

The provider should expose methods only.

No prompt engineering yet.

---

# Milestone B10 — Engine Skeletons

Create empty engines.

- DataIngestionEngine
- DataQualityEngine
- MetadataEngine
- StatisticsEngine
- DashboardEngine
- NLPEngine
- ExportEngine

Only class skeletons.

No implementation.

---

# Milestone B11 — Service Layer

Create services.

- UploadService
- MetadataService
- StatisticsService
- DashboardService
- AIService
- ExportService
- SessionService
- ConfigService

Each service should call the appropriate engine or provider.

Return mock data.

---

# Milestone B12 — Controllers

Create controllers.

Controllers should:

- Validate input
- Call services
- Return response envelope

No business logic.

---

# Milestone B13 — Routes

Create:

- upload.routes.ts
- metadata.routes.ts
- statistics.routes.ts
- dashboard.routes.ts
- ai.routes.ts
- export.routes.ts
- session.routes.ts
- config.routes.ts
- health.routes.ts

Register all routes.

---

# Milestone B14 — Server Bootstrap

Configure:

- Express
- JSON parser
- Compression
- Helmet
- CORS
- Logger
- Routes
- Error middleware

Acceptance:

Server boots successfully.

---

# Milestone B15 — Health & Config APIs

Implement:

GET /health

GET /config

Health response should include:

- status
- uptime
- memory usage
- Node version
- environment
- timestamp

Config endpoint should expose only frontend-safe values.

---

# Milestone B16 — Backend Verification

Verify:

- Project compiles
- No TypeScript errors
- No lint errors
- Routes registered
- Middleware executes
- Health endpoint works
- Config endpoint works

---

# Git Commit Strategy

Commit after every completed milestone.

Example:

git commit -m "Backend B3: Added constants"

git commit -m "Backend B6: Added middleware"

git commit -m "Backend B10: Added engine skeletons"

---

# Rules for AI Agents

Do not skip milestones.

Do not generate future milestones.

Do not implement feature logic until the infrastructure milestones are complete.

Every milestone must leave the backend runnable.

---

# Completion Criteria

Backend infrastructure is complete when:

✓ Express server starts

✓ All routes exist

✓ Controllers delegate to services

✓ Services delegate to engines/providers

✓ Configuration validated

✓ Logging operational

✓ Middleware operational

✓ Health endpoint operational

No business logic should exist yet.

---

End of Document