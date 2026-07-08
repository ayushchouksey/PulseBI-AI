# 14_Frontend_Architecture

Version: 1.0

---

# Purpose

This document defines the frontend architecture for PulseBI AI.

The frontend is responsible only for presentation, user interaction, and state management.

Business calculations must never occur in React components.

The frontend renders data received from the backend.

---

# Technology Stack

React 19

TypeScript

Vite

Zustand

TanStack Query

React Router

Plotly.js

Material UI (or custom design system)

React Hook Form

Axios

PapaParse (Client-side preview only)

React Grid Layout

Framer Motion

React Hot Toast

---

# Folder Structure

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

---

# Module Structure

Each module contains:

components/

hooks/

services/

store/

types/

utils/

index.ts

Example

modules/

dashboard/

components/

Dashboard.tsx

DashboardGrid.tsx

KpiCards.tsx

ChartWidget.tsx

FilterBar.tsx

ChatPanel.tsx

---

# Pages

Landing Page

Metadata Confirmation

Dashboard

404

---

# Layouts

Public Layout

Dashboard Layout

Modal Layout

---

# Components

Reusable components include:

Button

Input

Dropdown

Modal

Drawer

Card

Table

Tabs

Tooltip

Badge

Loader

Progress

Empty State

Error State

Chart Container

---

# State Management

Use Zustand.

Stores

Upload Store

Metadata Store

Dashboard Store

Chat Store

Theme Store

Session Store

UI Store

Stores should remain independent.

Communication happens through services.

---

# Server State

Use TanStack Query.

Cache:

Metadata

Statistics

Dashboard

AI Responses

Configuration

Benefits

Automatic caching

Retries

Background refresh

Request deduplication

---

# Routing

/

Landing Page

/dashboard

Dashboard

/settings

Future Settings

*

404

---

# API Layer

Axios

Single API client

Interceptors

Request timeout

Automatic error handling

Request ID propagation

---

# Hooks

Create reusable hooks.

Examples

useUpload()

useDashboard()

useMetadata()

useStatistics()

useChat()

useFilters()

useExport()

---

# Dashboard Rendering

Dashboard is configuration driven.

Render widgets using:

Dashboard JSON

Never hardcode charts.

---

# Chart Rendering

Use Plotly.

Chart component accepts:

Plotly configuration

Widget metadata

Export options

Loading state

Error state

---

# Responsive Design

Desktop

Tablet

Mobile

Responsive breakpoints

1200px

768px

480px

Dashboard widgets stack automatically.

---

# Theme

Looker-inspired

Light mode

Rounded corners

Soft shadows

Blue accent

Inter font

Spacing system

8px grid

---

# Styling

CSS Variables

Theme Tokens

Reusable utility classes

Minimal inline styles

---

# Performance

Lazy load routes

Lazy load Plotly

Memoize widgets

Virtualize tables

Debounce search

Avoid unnecessary renders

---

# Error Boundaries

Global Error Boundary

Widget Error Boundary

Chart Error Boundary

Prevent one widget failure from crashing the entire dashboard.

---

# Accessibility

ARIA labels

Keyboard navigation

Focus indicators

Screen reader support

High contrast

---

# Internationalization

Future support.

Keep all user-facing strings centralized.

---

# Testing

Future support:

Vitest

React Testing Library

Component tests

Hook tests

Store tests

---

# Logging

Frontend logs:

Navigation

Widget interactions

Errors

API failures

Performance timings

---

# Security

Escape HTML

Prevent XSS

Validate uploads

Never store sensitive data in local storage

---

# Success Criteria

The frontend should provide:

Responsive UI

Fast rendering

Reusable components

Clear separation of concerns

Minimal re-renders

Scalable architecture

Configuration-driven dashboard rendering

without embedding business logic.

---

End of Document