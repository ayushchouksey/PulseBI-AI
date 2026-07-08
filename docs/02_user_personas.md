# User Personas

Version: 1.0

---

# Purpose

This document defines the primary users of PulseBI AI.

The application is NOT intended for Data Scientists or Business Analysts.

Instead, it is designed for business users with little or no technical knowledge.

Every feature, workflow, interaction, and interface should be optimized for simplicity.

If there is a choice between flexibility and simplicity, simplicity should always win.

---

# Primary Persona

## Business Manager

Age

28–55

Experience

5–25 years in business.

Technical Knowledge

Low.

Knows Microsoft Excel.

Can upload CSV files.

Does NOT know:

- SQL
- Python
- Power BI
- Tableau
- LookML
- Data Modeling

Goals

- Understand business performance.
- Track KPIs.
- Find sales trends.
- Compare business performance.
- Generate reports quickly.
- Share reports with management.

Pain Points

Current BI tools are difficult.

Too many settings.

Too many chart options.

Complex terminology.

Needs analysts to create reports.

Success Criteria

Upload data.

Receive dashboard.

Ask questions.

Export report.

No technical knowledge required.

---

# Secondary Persona

## Startup Founder

Age

24–45

Technical Knowledge

Medium.

Can use SaaS applications.

Does not want to spend time learning BI tools.

Goals

Quickly understand

Revenue

Growth

Customers

Products

Marketing

Cashflow

Pain Points

Needs answers immediately.

Doesn't have analysts.

Prefers automation.

---

# Third Persona

## Sales Manager

Goals

Monitor

Sales

Revenue

Regions

Top Products

Targets

Questions they ask

Which region is performing best?

Which salesperson generated the highest revenue?

How much did revenue grow this month?

What products are declining?

---

# Fourth Persona

## Finance Manager

Goals

Monitor

Revenue

Expenses

Profit

Margins

Questions

What is our monthly revenue?

Which department spends the most?

Compare Q1 and Q2.

Show yearly trends.

---

# Fifth Persona

## Marketing Manager

Goals

Campaign Performance

Customer Acquisition

Conversion

Leads

Questions

Which campaign performs best?

Which channel generates most revenue?

How has conversion changed?

---

# Common Characteristics

All users

Can upload CSV files.

Understand tables.

Understand charts.

Understand business language.

Do NOT understand

SQL

Database Design

Measures

Dimensions

LookML

Aggregations

Calculated Fields

Relationships

Data Warehousing

Therefore

The application should never expose these concepts.

---

# User Expectations

The application should

Understand uploaded files automatically.

Choose the correct charts.

Suggest useful KPIs.

Generate summaries.

Answer questions naturally.

Never require SQL.

Never require dashboard building.

Never ask technical questions.

---

# UX Principles

The interface should feel

Friendly

Minimal

Modern

Professional

Fast

Trustworthy

Not overwhelming.

---

# Language Guidelines

Avoid

Dimension

Metric

Aggregation

Fact Table

Measure

Query

Schema

Index

Normalization

Instead use

Category

Number

Summary

Data

Report

Business Data

Sales

Revenue

Products

Dates

Customers

The application should speak the user's language.

---

# AI Assistant Personality

The AI assistant acts like a Business Analyst.

Not a software engineer.

Not a database administrator.

Not a data scientist.

The assistant should

Explain trends.

Answer clearly.

Suggest improvements.

Recommend visualizations.

Never expose technical implementation.

---

# AI Response Style

Responses should be

Short

Professional

Business friendly

Actionable

Example

Revenue increased by 12% this month, primarily driven by the West region.

Instead of

The SUM() aggregation indicates a positive delta.

---

# Error Handling Philosophy

Errors should never blame the user.

Instead of

Invalid CSV.

Say

We couldn't understand this file. Please ensure the first row contains column names.

Instead of

Unknown column type.

Say

We're not sure what this column represents. Please choose its type below.

---

# Dashboard Philosophy

The dashboard should answer the following questions immediately after generation

How is the business performing?

What changed?

What requires attention?

What opportunities exist?

Users should never need to build their own dashboard before seeing value.

---

# Chat Philosophy

Users should ask questions naturally.

Examples

What was my revenue in January?

Compare this year with last year.

Show top five products.

Which region needs attention?

Create a pie chart of revenue by category.

Replace this chart with a bar chart.

Filter only East region.

Remove this visualization.

---

# Accessibility

Support

Keyboard navigation

Screen readers

Color contrast

Responsive layouts

Readable typography

Large click targets

---

# Success Criteria

A first-time user should

Upload a CSV.

Confirm metadata.

Receive a dashboard.

Ask a question.

Generate a new chart.

Export a report.

Within five minutes.

Without reading documentation.

---

End of Document