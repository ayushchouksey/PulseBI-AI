# 21_Product_Decisions

Version: 1.0

---

# Building PulseBI AI

## Problem Statement

Modern Business Intelligence tools are extremely powerful, but many of them assume that the user already understands dashboards, dimensions, measures, aggregations, and chart selection.

For a business user who simply wants answers from a spreadsheet, this creates unnecessary friction.

The goal of PulseBI AI is to reduce that friction by allowing users to upload a CSV file, confirm how the data should be interpreted, and immediately begin asking business questions in natural language.

---

# Research

Before designing PulseBI AI, the following tools were evaluated.

Looker

Power BI

Metabase

Tableau

Qlik Sense

---

## Key Findings

### 1. Too many decisions before value

Many BI tools require the user to:

Understand measures

Understand dimensions

Choose chart types

Configure axes

Configure aggregations

Create filters

Only after completing these steps does the user see a dashboard.

For many business users this is overwhelming.

---

### 2. Technical terminology

Terms such as:

Dimensions

Measures

Joins

Schemas

Models

Explore

LookML

Relationships

are meaningful to analysts but intimidating to business stakeholders.

---

### 3. Empty dashboard problem

Most tools begin with an empty canvas.

Users must build their first visualization before learning anything.

PulseBI AI intentionally avoids this.

The application always generates an initial dashboard automatically.

---

### 4. AI often feels disconnected

Many modern BI products add an AI chatbot beside an existing dashboard.

The chatbot answers questions, but it rarely changes the dashboard itself.

PulseBI AI treats AI as a dashboard assistant rather than a standalone chatbot.

When appropriate, the dashboard evolves based on the conversation.

---

# Product Decisions

## Decision 1

Automatic metadata understanding.

Instead of asking users to define dimensions and measures manually, the application detects them automatically and allows users to review the results.

This provides confidence without forcing technical knowledge.

---

## Decision 2

Metadata confirmation instead of hidden automation.

Many AI products hide their assumptions.

PulseBI AI exposes them and allows correction before generating the dashboard.

This increases user trust.

---

## Decision 3

Dashboard first.

Instead of presenting an empty workspace, users immediately receive KPI cards, charts, filters, and tables.

The first screen should answer useful business questions without additional configuration.

---

## Decision 4

Natural language as the primary interaction model.

Users should be able to ask questions such as:

"What was revenue in January?"

"Show sales by region."

"Create a chart comparing categories."

without learning dashboard terminology.

---

## Decision 5

Backend computes.

AI explains.

All numerical calculations are deterministic.

The AI layer interprets those results instead of inventing them.

This significantly reduces hallucinations.

---

## Decision 6

Charts are generated automatically.

Business users should never need to understand visualization best practices.

The application selects appropriate chart types based on metadata and statistics.

---

## Decision 7

Configuration over customization.

Instead of exposing dozens of settings, the application chooses sensible defaults.

Users can override them only when necessary.

---

# Architecture Decisions

The backend owns:

Parsing

Validation

Statistics

Dashboard generation

AI orchestration

The frontend owns:

Presentation

Interaction

State management

Rendering

This separation keeps the client lightweight and maintainable.

---

# AI Usage

AI was used as an engineering accelerator rather than a replacement for engineering judgment.

The following activities benefited from AI assistance:

Architecture brainstorming

Engine design

Prompt refinement

Documentation

Code scaffolding

Component generation

Refactoring suggestions

Manual review and engineering decisions remained the responsibility of the developer.

---

# Scope Decisions

Several features were intentionally excluded from Version 1.

Authentication

Multiple datasets

Joins

Scheduled reports

Real-time dashboards

Collaborative editing

Cloud storage

These features would increase implementation complexity without improving the core experience for the assignment.

---

# Trade-offs

Using local LLMs avoids API costs and protects data privacy, but inference speed depends on the user's hardware.

A metadata confirmation step adds one interaction before dashboard generation, but significantly improves trust and accuracy.

Temporary in-memory sessions simplify the architecture while limiting long-term persistence.

---

# What I Would Build Next

If given another week, I would focus on:

Saving dashboards

Dashboard templates

Voice queries

Role-based dashboards

Multi-file relationships

Forecasting

Scheduled report generation

Real-time streaming dashboards

Dark mode

---

# Success Metrics

PulseBI AI succeeds if a first-time business user can:

Upload a CSV file.

Confirm the detected metadata.

Receive a meaningful dashboard.

Ask questions in plain language.

Create new visualizations without understanding BI terminology.

Gain useful insights within minutes.

---

# Closing Thoughts

The objective of this project was not to recreate an enterprise BI platform.

Instead, the goal was to rethink the first-time business intelligence experience.

PulseBI AI demonstrates that reducing decisions, using plain language, and combining deterministic analytics with AI assistance can create a more approachable experience for non-technical business users.

---

End of Document