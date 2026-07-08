# 03_Design_Principles.md

Version: 1.0

---

# Purpose

This document defines the product philosophy for PulseBI AI.

It does not describe features.

Instead, it defines how every feature should behave.

Whenever there is uncertainty during implementation, these principles should take priority over feature quantity.

The product should always optimize for simplicity, clarity, trust, and speed.

---

# Product Philosophy

PulseBI AI should feel like a smart business assistant rather than a traditional Business Intelligence platform.

Users should feel that the software understands their data automatically.

The application should never make users feel like they are configuring software.

Instead, it should feel like they are having a conversation with an intelligent analyst.

---

# Principle 1 — Zero Learning Curve

A first-time user should be able to:

Upload a CSV.

Review detected columns.

Receive a dashboard.

Ask questions.

Export reports.

Without reading documentation.

No onboarding tutorial should be required.

---

# Principle 2 — Business Language First

Never expose technical terminology.

Avoid words such as:

Metric

Dimension

Aggregation

Fact Table

Measure

Query

Schema

Normalization

LookML

Instead use:

Number

Category

Date

Summary

Business Data

Report

Sales

Revenue

Products

Customers

Business users should never feel like they are using an engineering tool.

---

# Principle 3 — Automation Over Configuration

Whenever possible, the application should make intelligent decisions automatically.

Examples:

Automatically detect date columns.

Automatically detect revenue columns.

Automatically detect customer identifiers.

Automatically choose chart types.

Automatically calculate KPIs.

Automatically generate dashboard layouts.

Users should only review suggestions instead of building dashboards manually.

---

# Principle 4 — Show Value Immediately

After uploading a CSV, users should receive value within seconds.

The first screen after upload should answer:

How is my business performing?

What changed?

What should I pay attention to?

The user should never see an empty dashboard.

---

# Principle 5 — Progressive Disclosure

Do not overwhelm users.

Show only essential information first.

Advanced functionality should appear only when needed.

Example:

Default Dashboard

↓

User asks for another chart

↓

Additional visualization appears

Instead of showing dozens of empty configuration panels.

---

# Principle 6 — AI Should Assist, Not Replace Logic

AI should never calculate business values.

AI should never generate random numbers.

AI should never estimate statistics.

The application should calculate all numerical values using deterministic backend logic.

The AI should only:

Explain

Summarize

Interpret

Recommend

Convert natural language into dashboard actions

This guarantees trustworthy business results.

---

# Principle 7 — Trust Through Transparency

Whenever the system makes an automatic decision, users should be able to review and edit it.

Examples:

Detected Column Type

Suggested Business Role

Selected Aggregation

Chosen Chart Type

Dashboard Layout

Users should always remain in control.

---

# Principle 8 — Every Chart Must Answer a Question

Charts should never exist simply because data is available.

Each visualization should answer a meaningful business question.

Examples:

Revenue Trend

How has revenue changed over time?

Revenue by Region

Which region performs best?

Profit by Category

Which category generates the highest profit?

Customer Distribution

Where are our customers located?

If a chart does not answer a business question, it should not be generated.

---

# Principle 9 — Natural Language Everywhere

Users should communicate naturally.

Examples:

What was my revenue in January?

Show top five products.

Create a pie chart.

Replace this with a line chart.

Remove this chart.

Compare this year with last year.

The application should never require users to learn commands.

---

# Principle 10 — Dashboard Is Alive

The dashboard is not static.

Every AI request should modify the dashboard dynamically.

Examples:

Add a chart

Remove a chart

Replace a chart

Filter a chart

Resize a chart

Change chart type

Update KPI

The dashboard should evolve as the conversation continues.

---

# Principle 11 — Every Interaction Should Feel Fast

Target interactions:

CSV validation

< 2 seconds

Metadata detection

< 2 seconds

Dashboard generation

< 5 seconds

AI summary

< 5 seconds

Chart updates

Instant after computation

Loading indicators should always communicate progress.

---

# Principle 12 — Minimal Visual Noise

Avoid:

Heavy borders

Bright colors

Dense tables

Small buttons

Crowded layouts

Prefer:

Whitespace

Rounded cards

Soft shadows

Simple typography

Clear spacing

Professional color palette

---

# Principle 13 — Explain Before Asking

If user action is required, first explain why.

Instead of:

"Choose Column Type"

Say:

"We found a few columns we're unsure about. Please confirm them before generating your dashboard."

This builds trust.

---

# Principle 14 — Helpful Errors

Errors should teach users.

Bad:

Invalid CSV.

Good:

We couldn't understand this file.
Please ensure the first row contains column names and the file is saved as CSV.

Every error should include guidance.

---

# Principle 15 — Export Should Be One Click

Users should never configure export settings.

Examples:

Download Chart

Download Dashboard

Export Table

Export PDF

Should all be one-click actions.

---

# Principle 16 — AI Is a Business Analyst

The AI assistant should behave like an experienced business analyst.

It should:

Highlight trends.

Identify risks.

Celebrate positive performance.

Suggest useful visualizations.

Recommend follow-up questions.

It should never behave like a programming assistant.

---

# Principle 17 — Extensible by Design

The architecture should allow future support for:

Excel files

Database connections

Cloud storage

Multiple dashboards

Dashboard templates

User accounts

Scheduled reports

Without major architectural changes.

---

# Final Product Experience

The ideal user journey should feel like this:

Upload data.

↓

Review detected columns.

↓

Instant dashboard.

↓

Understand business.

↓

Ask questions.

↓

Generate reports.

↓

Export insights.

Everything should feel effortless.

---

End of Document