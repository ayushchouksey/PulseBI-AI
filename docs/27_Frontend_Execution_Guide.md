# 27_Frontend_Execution_Guide

Version: 1.0

---

# Purpose

This document defines the implementation sequence for the React frontend.

The frontend should be developed incrementally.

Each milestone must produce a fully compilable application.

Only one milestone should be implemented at a time.

---

# Frontend Development Principles

The frontend is responsible only for:

• User Interface

• User Experience

• State Management

• API Communication

• Dashboard Rendering

• AI Interaction

Business logic must remain in the backend.

The frontend should remain configuration-driven whenever possible.

---

# UI Principles

Inspired by Looker.

Simple.

Minimal.

Clean.

Business-friendly.

No technical terminology.

Every screen should help the user complete one task.

---

# Milestone F1 — React Foundation

### Objective

Create the frontend foundation.

### Deliverables

- React
- TypeScript
- Vite
- ESLint
- Prettier
- Environment configuration

### Acceptance Criteria

- Application starts
- No TypeScript errors
- No ESLint errors

---

# Milestone F2 — Theme & Design System

### Deliverables

Create:

theme/

colors.ts

spacing.ts

typography.ts

radius.ts

shadow.ts

animations.ts

Global styles.

Dark mode structure (disabled).

Reusable design tokens.

### Acceptance Criteria

Consistent styling.

No inline styles.

---

# Milestone F3 — Application Layout

Create layouts.

Main Layout

Dashboard Layout

Authentication Layout (future-ready)

Responsive shell.

Sidebar.

Header.

Content area.

Footer.

### Acceptance Criteria

Navigation works.

Responsive.

---

# Milestone F4 — Routing

Create routing.

Home

Upload

Dashboard

404

Future routes placeholder.

### Acceptance Criteria

React Router configured.

Lazy loading enabled.

---

# Milestone F5 — Global State

Implement Zustand stores.

Session Store

Metadata Store

Dashboard Store

Filter Store

Chat Store

Notification Store

Loading Store

### Acceptance Criteria

Stores initialized.

No business logic.

---

# Milestone F6 — API Layer

Create

api/

httpClient.ts

upload.api.ts

metadata.api.ts

dashboard.api.ts

ai.api.ts

statistics.api.ts

export.api.ts

session.api.ts

### Acceptance Criteria

Axios configured.

Error interceptor.

Loading interceptor.

---

# Milestone F7 — Shared Components

Create reusable components.

Button

Input

Textarea

Dropdown

Checkbox

Radio

Badge

Tooltip

Card

Dialog

Loader

Toast

Table

Pagination

Search Box

Empty State

Error State

Skeleton Loader

### Acceptance Criteria

Reusable.

Accessible.

Consistent styling.

---

# Milestone F8 — Upload Module

Create upload page.

Drag & Drop.

Browse File.

Progress bar.

Validation.

Upload history.

### Acceptance Criteria

CSV uploads successfully.

Validation shown.

Loading state.

---

# Milestone F9 — Metadata Confirmation Modal

Create full-screen modal.

Scrollable vertically.

Scrollable horizontally.

Column mapping.

Search.

Filtering.

Bulk edit.

Confidence indicator.

Validation warnings.

Save.

Cancel.

Reset.

### Acceptance Criteria

User can modify metadata before dashboard generation.

---

# Milestone F10 — Dashboard Foundation

Create dashboard shell.

Grid layout.

Widget renderer.

Responsive resizing.

Widget toolbar.

### Acceptance Criteria

Dashboard loads from JSON.

No hardcoded widgets.

---

# Milestone F11 — KPI Widgets

Create:

Metric Card

Trend Card

Comparison Card

Summary Card

### Acceptance Criteria

Reusable widgets.

Responsive.

---

# Milestone F12 — Plotly Integration

Create chart renderer.

Supported charts.

Bar

Line

Pie

Donut

Area

Scatter

Table

Histogram

Heatmap

### Acceptance Criteria

Charts render dynamically.

Download supported.

---

# Milestone F13 — Data Table

Create advanced table.

Sorting.

Filtering.

Search.

Pagination.

Column visibility.

Download.

### Acceptance Criteria

Fully interactive.

---

# Milestone F14 — Dashboard Filters

Global filters.

Date.

Category.

Product.

Region.

Search.

Reset.

Apply.

### Acceptance Criteria

Dashboard updates correctly.

---

# Milestone F15 — AI Chat Panel

Floating AI assistant.

Prompt suggestions.

Conversation history.

Streaming indicator.

Typing indicator.

Markdown rendering.

### Acceptance Criteria

Questions sent to backend.

Responses displayed.

---

# Milestone F16 — AI Dashboard Actions

Support actions such as:

Generate chart.

Replace widget.

Add widget.

Remove widget.

Highlight KPI.

Business summary.

Recommendations.

### Acceptance Criteria

Dashboard updates without refresh.

---

# Milestone F17 — Export Features

Export:

Dashboard

Chart

Table

CSV

Excel

PNG

SVG

PDF

### Acceptance Criteria

Downloads work correctly.

---

# Milestone F18 — Animations

Transitions.

Dialogs.

Loading.

Dashboard updates.

Hover effects.

Notifications.

### Acceptance Criteria

Animations remain subtle.

Performance maintained.

---

# Milestone F19 — Responsive Design

Desktop

Laptop

Tablet

Mobile

### Acceptance Criteria

Usable across screen sizes.

No horizontal overflow.

---

# Milestone F20 — Accessibility

Keyboard navigation.

Focus management.

ARIA labels.

Color contrast.

Screen reader support.

### Acceptance Criteria

Basic accessibility compliance.

---

# Milestone F21 — Frontend Verification

Verify:

Application starts.

No console errors.

No TypeScript errors.

No ESLint errors.

API integration works.

Dashboard renders.

Charts download.

Responsive layout.

Accessibility basics.

---

# Git Commit Strategy

Commit after every milestone.

Examples:

git commit -m "Frontend F5: Zustand stores"

git commit -m "Frontend F9: Metadata confirmation modal"

git commit -m "Frontend F15: AI chat panel"

---

# Rules for AI Agents

Do not implement future milestones.

Do not mix UI and business logic.

Always reuse shared components.

Keep components small and focused.

Follow the design system.

Follow the component architecture.

---

# Completion Criteria

Frontend is complete when:

✓ Upload workflow functions

✓ Metadata confirmation works

✓ Dashboard renders dynamically

✓ AI interaction works

✓ Plotly charts render

✓ Export works

✓ Responsive layout verified

✓ Accessibility checks completed

---

End of Document