# 16_UI_UX_Design_System

Version: 1.0

---

# Purpose

This document defines the visual language of PulseBI AI.

The interface should feel modern, trustworthy, and approachable for non-technical business users.

The design should reduce cognitive load while keeping advanced capabilities easily discoverable.

---

# Design Principles

Clarity over density

Whitespace over clutter

Automation over configuration

Consistency over creativity

Business language over technical language

One primary action per screen

Minimal visual noise

---

# Visual Inspiration

Inspired by:

Looker

Linear

Stripe Dashboard

Notion

Vercel Dashboard

Do not replicate any interface directly.

Create an original design language.

---

# Color Palette

Primary

#2563EB

Secondary

#4F46E5

Success

#22C55E

Warning

#F59E0B

Error

#EF4444

Background

#F8FAFC

Surface

#FFFFFF

Border

#E5E7EB

Primary Text

#111827

Secondary Text

#6B7280

Muted Text

#9CA3AF

---

# Typography

Font

Inter

Headings

600–700 weight

Body

400 weight

Line height

1.5

Avoid more than three font sizes on a single screen.

---

# Spacing System

Base unit

8px

Common spacing

8

16

24

32

48

64

Use consistent spacing throughout.

---

# Border Radius

Inputs

12px

Buttons

12px

Cards

16px

Dialogs

20px

Charts

16px

---

# Shadows

Use subtle elevation.

Avoid heavy shadows.

Cards

Small

Dialogs

Medium

Dropdowns

Small

---

# Buttons

Primary

Solid blue

Secondary

Outlined

Tertiary

Text only

Danger

Red

Loading state

Spinner

Disabled state

Reduced opacity

---

# Inputs

Rounded

Clear labels

Placeholder text

Validation message below field

Never rely only on placeholder text.

---

# Upload Area

Large drag-and-drop zone

Upload icon

Supported file formats

Progress indicator

Friendly empty state

---

# Metadata Confirmation Modal

Full-screen modal

Scrollable vertically

Scrollable horizontally

Sticky header

Search input

Column filters

Bulk edit support

Action buttons fixed at bottom

---

# Dashboard Layout

Top Navigation

↓

Global Search

↓

KPI Cards

↓

Primary Charts

↓

Secondary Charts

↓

Data Table

↓

AI Chat Panel

Responsive grid using React Grid Layout.

---

# KPI Cards

Display:

Title

Value

Trend

Change percentage

Small icon

Use subtle color accents.

---

# Charts

Use Plotly.

Every chart card includes:

Title

Subtitle

Menu

Download

Fullscreen

Refresh

Delete

Loading state

Error state

---

# Data Table

Sticky header

Pagination

Sorting

Filtering

Resizable columns

Column visibility

Download

Copy

---

# Global Search

Position

Top of dashboard

Placeholder

Ask anything about your business...

Examples below input

Show revenue by region

Compare Q1 and Q2

Create a pie chart

Summarize performance

---

# AI Chat Panel

Collapsible

Right side (desktop)

Bottom sheet (mobile)

Conversation bubbles

Suggested prompts

Typing indicator

Response timestamp

---

# Icons

Use Lucide React.

Simple outline icons.

Avoid decorative icons.

---

# Navigation

Minimal.

Logo

Dataset name

Upload

Export

Theme

Settings

No deep menu hierarchy.

---

# Animations

Use Framer Motion.

Animations should be:

Fast

Subtle

Purposeful

Examples

Card fade-in

Modal transition

Widget insertion

Loading skeleton

Avoid distracting animations.

---

# Loading States

Use skeleton loaders.

Show progress for:

Upload

Metadata generation

Dashboard generation

AI response

Export

---

# Empty States

No dataset

No charts

No search results

No filters

No AI responses

Each state should include:

Illustration

Message

Primary action

---

# Error States

Friendly language.

Explain:

What happened

Why

How to fix it

Provide Retry button.

---

# Responsive Design

Desktop

≥1200px

Tablet

768–1199px

Mobile

<768px

Dashboard widgets stack vertically on smaller screens.

---

# Accessibility

WCAG AA contrast

Keyboard navigation

Visible focus states

Screen reader labels

Large click targets

---

# Theme Support

Light mode (Version 1)

Dark mode (Future)

Use CSS variables for theming.

---

# Microinteractions

Button hover

Card hover

Tooltip

Dropdown animation

Widget drag feedback

Filter chips

Keep interactions lightweight.

---

# Dashboard Philosophy

The dashboard should answer these questions immediately:

How is the business performing?

What changed?

What needs attention?

What should I explore next?

Users should never see an empty canvas.

---

# Success Criteria

The interface should feel:

Professional

Fast

Minimal

Business-friendly

Confident

Trustworthy

Approachable

without exposing technical complexity.

---

End of Document