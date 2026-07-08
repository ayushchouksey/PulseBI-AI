# 17_Component_Specification

Version: 1.0

---

# Purpose

This document defines every reusable React component used in PulseBI AI.

Each component should have a single responsibility.

Components must remain presentation-focused.

Business logic belongs to services and engines.

---

# Component Design Principles

Reusable

Composable

Accessible

Stateless whenever possible

Strongly typed

Configuration driven

Minimal props

---

# ATOMS

---

## Button

Purpose

Trigger user actions.

Variants

Primary

Secondary

Ghost

Danger

Icon

States

Default

Hover

Active

Loading

Disabled

Props

label

icon

variant

loading

disabled

onClick

Accessibility

Keyboard support

ARIA label

Visible focus state

---

## Input

Purpose

Capture text input.

Supports

Label

Placeholder

Validation

Helper text

Prefix

Suffix

Clear button

---

## Spinner

Purpose

Indicate loading.

Sizes

Small

Medium

Large

---

## Badge

Purpose

Display status.

Variants

Success

Warning

Error

Info

Neutral

---

## Icon

Use Lucide React.

Icons should remain decorative unless conveying information.

---

# MOLECULES

---

## GlobalSearchBar

Purpose

Accept natural language business queries.

Placeholder

Ask anything about your business...

Features

Suggested prompts

Clear button

Loading indicator

Submit on Enter

Props

value

loading

suggestions

onSubmit

onChange

---

## KPI Card

Purpose

Display one KPI.

Fields

Title

Value

Trend

Percentage

Icon

Actions

Tooltip

Accessibility

Readable values

High contrast

---

## FilterDropdown

Purpose

Filter dashboard data.

Supports

Search

Multi-select

Clear

Select all

---

## UploadCard

Purpose

Display upload information.

Shows

Filename

Size

Rows

Columns

Upload progress

---

# ORGANISMS

---

## UploadZone

Purpose

Upload CSV files.

Features

Drag & Drop

Browse

Progress

Validation

Retry

Replace file

States

Empty

Dragging

Uploading

Completed

Error

---

## MetadataTable

Purpose

Allow users to review and edit detected metadata.

Features

Sticky header

Search

Sorting

Column editing

Bulk actions

Scrollable X

Scrollable Y

Editable cells

Footer actions

Generate Dashboard

Reset

Cancel

---

## DashboardGrid

Purpose

Render widgets dynamically.

Input

Dashboard JSON

Supports

Drag

Resize

Collapse

Remove

Duplicate

Add widget

Uses React Grid Layout.

---

## ChartCard

Purpose

Render one Plotly visualization.

Contains

Title

Subtitle

Chart

Toolbar

Loading state

Error state

Toolbar Actions

Download PNG

Download SVG

Fullscreen

Refresh

Delete

Duplicate

---

## KpiSection

Purpose

Display KPI cards.

Automatically responsive.

Maximum

4 cards per row.

---

## FilterBar

Purpose

Display dashboard filters.

Supports

Date

Category

Region

Product

Custom filters

Actions

Clear All

Apply

Reset

---

## DataTable

Purpose

Display raw business data.

Features

Pagination

Sorting

Filtering

Sticky header

Column resize

Column visibility

Download CSV

Download Excel

Copy

Virtual scrolling

---

## ChatPanel

Purpose

Allow users to converse with their dashboard.

Supports

Conversation history

Typing indicator

Suggested prompts

Markdown

Scrollable history

Message timestamps

---

## ExportMenu

Purpose

Export dashboard assets.

Options

Dashboard PDF

PNG

SVG

CSV

Excel

Individual chart

---

## TopNavigation

Purpose

Application navigation.

Contains

Logo

Dataset

Upload

Export

Theme

Settings

---

# TEMPLATES

---

## LandingTemplate

Contains

Header

Upload

Help

Footer

---

## DashboardTemplate

Contains

Navigation

Search

KPIs

Dashboard Grid

Filters

Table

Chat

---

# PAGES

---

## LandingPage

Responsibilities

Upload dataset

Show supported formats

Navigate to metadata confirmation

---

## MetadataPage

Responsibilities

Display metadata table

Accept user edits

Generate dashboard

---

## DashboardPage

Responsibilities

Render dashboard

Handle AI interactions

Apply filters

Export reports

---

# Common Component Rules

Every component must support:

Loading state

Empty state

Error state

Accessibility

Responsive behavior

Dark mode compatibility (future)

---

# Performance Rules

Memoize expensive components.

Lazy load heavy components.

Avoid unnecessary re-renders.

Use virtualization for large datasets.

---

# Testing Requirements

Every reusable component should support:

Unit testing

Accessibility testing

Snapshot testing

Interaction testing

---

# Naming Convention

PascalCase

Examples

ChartCard

MetadataTable

UploadZone

FilterBar

DashboardGrid

GlobalSearchBar

---

# Success Criteria

The component library should be:

Reusable

Consistent

Accessible

Scalable

Easy to maintain

Configuration driven

without embedding business logic.

---

End of Document