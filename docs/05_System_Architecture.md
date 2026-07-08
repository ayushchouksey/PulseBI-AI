# 05_System_Architecture

Version 1.0

---

# Purpose

This document defines the complete software architecture for PulseBI AI.

The application must follow Clean Architecture principles.

Every module should be independent.

Every feature should be replaceable.

Business logic should never exist inside React components.

The frontend should remain independent of AI providers.

The backend should remain independent of UI implementation.

---

# High Level Architecture

                Browser
                    │
                    ▼
          React Frontend (Vite)
                    │
             REST API (Axios)
                    │
                    ▼
           Express Backend
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
 CSV Engine   Statistics Engine   AI Engine
     │              │              │
     └──────────────┼──────────────┘
                    ▼
          Dashboard Engine
                    │
                    ▼
             JSON Response
                    │
                    ▼
            React Components

---

# Architectural Principles

The application should follow

Single Responsibility Principle

Open Closed Principle

Dependency Injection where applicable

Feature Based Folder Structure

Reusable Components

Reusable Business Logic

Strong Typing

Composition over Inheritance

---

# Frontend Architecture

The frontend is divided into Features.

Each Feature owns

Components

Hooks

Store

Services

Types

Utilities

The feature should be self contained.

Features must not directly depend on each other.

Communication should occur through shared services or stores.

---

# Frontend Folder Structure

src/

app/

assets/

features/

shared/

layouts/

store/

theme/

styles/

types/

---

# Feature Modules

Upload

Metadata

Dashboard

Charts

Chat

Filters

Tables

Export

Settings

Each module should expose only public APIs.

Internal implementation must remain private.

---

# Shared Layer

The shared folder contains

Buttons

Inputs

Dialogs

Cards

Tables

Utilities

Hooks

Icons

Constants

Themes

API Client

Types

This layer must not contain business logic.

---

# State Management

Use Zustand.

Create independent stores.

uploadStore

metadataStore

dashboardStore

chatStore

themeStore

Stores should never know about each other directly.

Communication occurs through Services.

---

# Routing

Landing Page

Dashboard

404

Future routes should be easy to add.

---

# Backend Architecture

Backend follows Module Based Architecture.

Modules

Upload

Validation

Parser

Metadata

Statistics

Dashboard

AI

Export

Health

Each module owns

Controller

Service

Routes

Types

Validators

Utilities

---

# API Design

REST API

JSON

Stateless

Every endpoint returns

Success

Data

Error

Message

Timestamp

Request ID

Example

{
 success: true,
 data: {},
 error: null,
 timestamp: "...",
 requestId: "..."
}

---

# Data Flow

CSV Upload

↓

Validation

↓

Parsing

↓

Metadata Generation

↓

Metadata Confirmation

↓

Statistics Generation

↓

Dashboard Configuration

↓

Dashboard Response

↓

React Rendering

---

# Dataset Context

The backend maintains a Dataset Context.

Example

{
 dataset,

 metadata,

 statistics,

 dashboard,

 filters,

 aiContext
}

Every module consumes this context.

No module should parse CSV independently.

---

# Dashboard Configuration

The dashboard is completely configuration driven.

Example

{
 dashboardTitle,

 widgets: [],

 filters: [],

 layout: {},

 theme: {}
}

React should never hardcode dashboards.

Everything renders from configuration.

---

# Widget Structure

Each widget contains

id

type

title

chartType

dataSource

configuration

position

size

exportOptions

visibility

This allows dynamic dashboards.

---

# Statistics Engine

Responsible for

SUM

AVG

MIN

MAX

COUNT

GROUP BY

Trend

Growth

Comparison

Top N

Bottom N

Percentages

No AI calculations.

---

# Metadata Engine

Responsible for

Column Detection

Business Roles

Confidence Score

Data Type Detection

Aggregation Suggestion

Display Name

User Overrides

Produces Metadata JSON.

---

# AI Engine

The AI Engine never receives raw CSV.

Input

Metadata

Statistics

Dashboard Context

Conversation History

Output

Business Summary

Natural Language Answer

Dashboard Actions

Recommendations

---

# AI Provider Pattern

Create an interface

AIProvider

Methods

generateSummary()

answerQuestion()

generateDashboardAction()

Providers

OllamaProvider

OpenAIProvider

GeminiProvider

ClaudeProvider

Only the provider changes.

Business logic remains unchanged.

---

# Dashboard Action Model

Every AI response becomes an action.

Examples

CREATE_CHART

DELETE_CHART

UPDATE_CHART

FILTER

EXPORT

ANSWER

Every action contains structured JSON.

Never generate Plotly code.

---

# Logging

Every request should generate

Request ID

Execution Time

Error Logs

Warnings

Performance Metrics

---

# Error Handling

Global Error Middleware

Validation Errors

Business Errors

System Errors

AI Errors

CSV Errors

Return consistent JSON.

---

# Security

Sanitize uploaded files.

Validate CSV.

Limit upload size.

Escape user inputs.

Prevent script injection.

Never trust uploaded data.

---

# Performance

Lazy Loading

React Memo

Virtual Tables

Chunk Processing

Debounced Search

Memoized Statistics

Server-side calculations

---

# Scalability

Future support for

Excel

Google Sheets

Database Connections

Multiple Dashboards

Authentication

Organizations

Cloud Storage

Real Time Collaboration

Architecture should support these without major refactoring.

---

# Future AI

Future providers should require only

Implement AIProvider

Register Provider

No frontend changes.

---

End of Document