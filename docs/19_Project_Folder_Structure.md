# 19_Project_Folder_Structure

Version: 1.0

---

# Purpose

This document defines the physical directory structure for the PulseBI AI project.

The goal is to provide a scalable, maintainable, and production-ready project layout.

The project follows a monorepo architecture.

---

# Root Structure

pulsebi-ai/

apps/

packages/

docs/

sample-data/

scripts/

.github/

README.md

package.json

.gitignore

---

# apps/client

Frontend React application.

Structure

src/

app/

assets/

components/

config/

constants/

hooks/

layouts/

modules/

pages/

routes/

services/

stores/

styles/

theme/

types/

utils/

main.tsx

public/

package.json

vite.config.ts

tsconfig.json

---

# modules

Feature-based modules.

upload/

metadata/

dashboard/

chat/

export/

settings/

Each module contains:

components/

hooks/

services/

store/

types/

utils/

---

# components

Reusable UI components.

atoms/

molecules/

organisms/

templates/

---

# assets

logos/

icons/

images/

fonts/

---

# services

API client

Upload service

Dashboard service

Metadata service

AI service

Export service

---

# stores

Zustand stores.

Upload

Metadata

Dashboard

Chat

Session

Filter

UI

Configuration

---

# apps/server

Backend Express application.

Structure

src/

config/

controllers/

engines/

middleware/

models/

providers/

routes/

services/

validators/

utils/

types/

constants/

logs/

uploads/

server.ts

package.json

tsconfig.json

---

# controllers

One controller per domain.

UploadController

MetadataController

DashboardController

AIController

ExportController

HealthController

---

# services

Coordinate engines.

UploadService

DashboardService

MetadataService

AIService

ExportService

---

# engines

Business logic.

DataIngestionEngine

DataQualityEngine

BusinessIntelligenceUnderstandingEngine

StatisticsEngine

DashboardOrchestrationEngine

NaturalLanguageProcessingLayer

ExportEngine

---

# providers

External integrations.

OllamaProvider

Future

OpenAIProvider

GeminiProvider

ClaudeProvider

---

# middleware

Logger

Validation

Error Handler

Request ID

Compression

CORS

Security Headers

---

# validators

Upload validator

Metadata validator

Dashboard validator

AI validator

---

# utils

CSV helpers

Date helpers

Chart helpers

File helpers

Logger helpers

---

# packages/shared-types

Shared TypeScript interfaces.

API Models

Dashboard Models

Metadata Models

Statistics Models

Chart Models

AI Models

---

# packages/shared-utils

Reusable utilities.

Date utilities

Formatting

Validation helpers

Constants

---

# packages/shared-config

Shared configuration.

Theme

Limits

Chart defaults

Application constants

---

# docs

Architecture documents

API documentation

Screenshots

Assignment write-up

---

# sample-data

Retail.csv

Sales.csv

Healthcare.csv

Finance.csv

Employee.csv

---

# scripts

Development helpers.

Clean uploads

Generate sample data

Seed configuration

---

# .github

GitHub Actions (future)

Issue templates

Pull request template

---

# Root Files

README.md

Project overview

Installation

Running locally

Architecture

Features

Assignment notes

---

package.json

Workspace configuration

Shared scripts

---

.gitignore

Node modules

Logs

Uploads

Environment files

Build artifacts

---

# Naming Conventions

Folders

kebab-case

Files

PascalCase (React components)

camelCase (utilities)

Types

PascalCase

Constants

UPPER_SNAKE_CASE

---

# Build Output

client/

dist/

server/

dist/

No generated files committed to Git.

---

# Success Criteria

The project structure should:

Support future growth

Separate frontend and backend cleanly

Enable shared code

Remain easy to navigate

Follow enterprise conventions

Be immediately understandable to new contributors.

---

End of Document