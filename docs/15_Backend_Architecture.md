# 15_Backend_Architecture

Version: 1.0

---

# Purpose

This document defines the backend architecture for PulseBI AI.

The backend is responsible for:

Processing uploaded datasets

Validating data

Generating metadata

Computing statistics

Building dashboard configurations

Managing AI interactions

Exporting reports

Serving REST APIs

The backend should remain stateless.

---

# Technology Stack

Node.js

Express

TypeScript

Multer

PapaParse

Arquero

Zod

UUID

Axios

Pino Logger

Ollama HTTP API

---

# Folder Structure

backend/

src/

config/

controllers/

engines/

middleware/

models/

routes/

services/

providers/

validators/

utils/

types/

constants/

logs/

uploads/

server.ts

---

# Route Layer

Responsibilities

Define endpoints

Register middleware

Forward requests

No business logic.

---

# Controller Layer

Responsibilities

Receive HTTP request

Validate request

Call service

Return response

No calculations.

No CSV parsing.

---

# Service Layer

Responsibilities

Coordinate engines

Manage workflow

Transform responses

Handle transactions

Return domain objects

No HTTP logic.

---

# Engine Layer

Contains the core business logic.

Engines

Data Ingestion Engine

Data Quality Engine

Business Intelligence Understanding Engine

Statistics Engine

Dashboard Orchestration Engine

Natural Language Processing Layer

Export Engine

Each engine must remain independent.

---

# Provider Layer

Abstract external integrations.

Providers

Ollama Provider

Future:

OpenAI Provider

Gemini Provider

Claude Provider

DeepSeek Provider

Each provider implements the same interface.

---

# Middleware

Request Logger

Request ID

CORS

Compression

Security Headers

Error Handler

Validation

Rate Limiter (future)

---

# Validation

Use Zod.

Validate:

Request body

Path parameters

Query parameters

Environment variables

Uploaded files

---

# Configuration

Centralize configuration.

Examples

Upload limits

Chart limits

Timeouts

LLM provider

Theme defaults

Supported exports

---

# Environment Variables

PORT

NODE_ENV

OLLAMA_BASE_URL

OLLAMA_MODEL

MAX_FILE_SIZE

MAX_ROWS

MAX_COLUMNS

LOG_LEVEL

---

# Logging

Use Pino.

Log:

Request ID

Route

Execution time

Errors

Warnings

Engine timings

AI response time

Never log raw dataset contents.

---

# Error Handling

Global error middleware.

Error categories

Validation Error

CSV Error

Engine Error

AI Error

Export Error

Unexpected Error

All responses follow the standard API response model.

---

# File Upload

Use Multer.

Temporary storage only.

Files are deleted after processing.

Never persist uploaded datasets.

---

# CSV Parsing

Use PapaParse.

Requirements

Streaming when possible

Header parsing

Delimiter detection

Encoding support

Graceful failure

---

# Statistics

Use Arquero.

Responsibilities

Aggregation

Grouping

Filtering

Sorting

Derived metrics

Frontend must never calculate statistics.

---

# AI Integration

The backend communicates with AI providers through the Provider Layer.

Workflow

Receive structured context

↓

Build prompt

↓

Send to provider

↓

Validate response

↓

Convert to dashboard action

↓

Return structured JSON

The rest of the application must not depend on a specific LLM.

---

# Session Management

Temporary in-memory session.

Stores

Dataset context

Metadata

Statistics

Dashboard state

Conversation history

No authentication required in Version 1.

---

# Security

Validate uploads

Escape user input

Prevent path traversal

Limit upload size

Reject executable files

Sanitize filenames

Validate MIME type

Never execute uploaded content

---

# Performance

Stream file processing where possible

Reuse computed statistics

Avoid duplicate parsing

Cache dashboard configuration during session

Parallelize independent engine execution when safe

---

# Dependency Rules

Routes → Controllers

Controllers → Services

Services → Engines

Engines → Utilities

Providers → External APIs

Never reverse dependencies.

---

# Testing Strategy (Future)

Unit Tests

Engine Tests

API Tests

Integration Tests

Provider Mock Tests

---

# Deployment

Stateless application

Container-ready

Environment-driven configuration

No local file persistence

Suitable for:

Local development

Docker

Railway

Render

Fly.io

---

# Success Criteria

The backend should provide:

Clean module separation

Independent engines

Provider abstraction

Fast CSV processing

Reliable statistics

Structured AI integration

Consistent APIs

Enterprise-grade maintainability

without coupling business logic to HTTP or AI providers.

---

End of Document