# 18_State_Management_Flow

Version: 1.0

---

# Purpose

This document defines how application state is managed in PulseBI AI.

State should be predictable, modular, and easy to debug.

Business calculations must never be stored in client state.

The backend remains the source of truth for business data.

---

# State Management Stack

Zustand

TanStack Query

React Context (Theme only)

Local Component State

---

# State Categories

UI State

Session State

Dashboard State

Metadata State

Upload State

Chat State

Filter State

Configuration State

---

# Store Responsibilities

Each store owns only one domain.

No store should manipulate another store directly.

---

# Upload Store

Purpose

Manage dataset upload lifecycle.

State

selectedFile

uploadStatus

progress

datasetId

errors

Actions

selectFile()

upload()

reset()

cancel()

---

# Metadata Store

Purpose

Store detected metadata and user overrides.

State

metadata

editedColumns

confidenceScores

validationStatus

Actions

loadMetadata()

updateColumn()

resetChanges()

saveChanges()

---

# Dashboard Store

Purpose

Maintain current dashboard configuration.

State

dashboardJson

widgets

layout

selectedWidget

Actions

loadDashboard()

updateWidget()

addWidget()

removeWidget()

moveWidget()

resizeWidget()

resetDashboard()

---

# Filter Store

Purpose

Manage active dashboard filters.

State

selectedFilters

dateRange

quickFilters

Actions

applyFilter()

clearFilter()

resetFilters()

---

# Chat Store

Purpose

Manage AI conversation.

State

messages

loading

suggestions

conversationId

Actions

sendMessage()

receiveMessage()

clearConversation()

---

# Session Store

Purpose

Maintain application session.

State

datasetId

sessionId

dashboardId

metadataVersion

statisticsVersion

Actions

startSession()

restoreSession()

endSession()

---

# UI Store

Purpose

Temporary interface state.

State

sidebarOpen

theme

modalOpen

loadingOverlay

notifications

Actions

toggleSidebar()

openModal()

closeModal()

showToast()

hideToast()

---

# Configuration Store

Purpose

Application configuration.

State

theme

supportedCharts

exportFormats

limits

Actions

loadConfig()

---

# Server State

Managed by TanStack Query.

Cache

Metadata

Statistics

Dashboard

AI Responses

Configuration

---

# Data Flow

Upload

↓

Upload Store

↓

Backend

↓

Metadata Store

↓

Dashboard Store

↓

React Components

---

# AI Flow

User Query

↓

Chat Store

↓

API Service

↓

Backend NLP Layer

↓

Dashboard Update

↓

Dashboard Store

↓

UI Refresh

---

# Filter Flow

User

↓

Filter Store

↓

Backend

↓

Dashboard Store

↓

Charts

Tables

KPIs

---

# Store Communication

Stores must not call each other directly.

Communication occurs through:

Services

React hooks

API responses

---

# Persistence

Persist only:

Theme

Last dataset ID (optional)

Dashboard layout (session)

Do not persist:

Uploaded CSV

Statistics

Conversation history

---

# Error Handling

Each store maintains its own:

loading

error

lastUpdated

status

Never share error states.

---

# Performance

Use selectors to avoid unnecessary renders.

Memoize derived values.

Keep store state minimal.

Avoid storing computed data.

---

# Debugging

Enable Zustand DevTools in development.

Log significant state transitions.

---

# Success Criteria

State management should provide:

Clear ownership

Minimal coupling

Predictable updates

Fast rendering

Easy debugging

Scalable architecture

without circular dependencies.

---

End of Document