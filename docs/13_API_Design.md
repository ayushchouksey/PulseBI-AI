# 13_API_Design

Version 1.0

---

# Purpose

This document defines every backend REST API exposed by PulseBI AI.

All APIs must be stateless.

Every request and response must use JSON unless explicitly stated otherwise.

All endpoints must return the standard API response model defined in Core Data Models.

---

# Base URL

/api/v1

---

# API Principles

RESTful

Stateless

JSON Responses

Consistent Error Format

Request Validation

Versioned APIs

---

# Common Response Format

Every endpoint returns:

{
    "success": true,
    "data": {},
    "message": "",
    "errors": [],
    "requestId": "",
    "timestamp": ""
}

---

# Upload Module

POST /upload

Purpose

Upload a CSV dataset.

Request

multipart/form-data

Fields

file

Response

Dataset Model

Errors

Unsupported File

Large File

Invalid CSV

---

# Metadata Module

GET /metadata/{datasetId}

Purpose

Retrieve generated metadata.

Response

Metadata Model

---

PUT /metadata/{datasetId}

Purpose

Save user metadata overrides.

Body

{
    "columns":[]
}

Response

Updated Metadata

---

# Statistics Module

GET /statistics/{datasetId}

Purpose

Retrieve all computed statistics.

Response

Statistics Model

---

# Dashboard Module

POST /dashboard/generate

Purpose

Generate initial dashboard.

Request

{
    "datasetId":"",
    "metadata":{}
}

Response

Dashboard Model

---

GET /dashboard/{dashboardId}

Purpose

Load dashboard.

---

PUT /dashboard/{dashboardId}

Purpose

Update dashboard layout.

Body

Dashboard Model

---

DELETE /dashboard/{dashboardId}/widgets/{widgetId}

Purpose

Delete widget.

---

POST /dashboard/widgets

Purpose

Create widget.

Body

Chart Request

---

PUT /dashboard/widgets/{widgetId}

Purpose

Update widget.

---

# AI Module

POST /ai/query

Purpose

Process natural language requests.

Request

{
    "question":"",
    "dashboardContext":{},
    "conversationContext":{}
}

Response

AI Response Model

---

POST /ai/summary

Purpose

Generate executive summary.

---

POST /ai/recommendations

Purpose

Suggest additional insights.

---

# Export Module

POST /export/dashboard

Purpose

Export dashboard.

Formats

PDF

PNG

SVG

---

POST /export/chart

Purpose

Export single chart.

---

POST /export/table

Purpose

Export table.

Formats

CSV

Excel

---

# Health Module

GET /health

Purpose

Application health.

Response

{
    "status":"UP"
}

---

# Configuration Module

GET /config

Purpose

Retrieve application configuration.

Includes

Theme

Chart Types

Supported Exports

Limits

---

# Session Module

POST /session

Purpose

Create temporary session.

---

GET /session/{id}

Purpose

Load session.

---

DELETE /session/{id}

Purpose

Destroy session.

---

# Validation Rules

Every endpoint must validate:

Request body

Query parameters

Path parameters

Content type

Required fields

---

# HTTP Status Codes

200

Success

201

Created

400

Bad Request

404

Not Found

409

Conflict

413

Payload Too Large

422

Validation Error

500

Internal Server Error

---

# Middleware

All requests pass through:

Request ID

Logger

Error Handler

Validation

Security Headers

Compression

CORS

---

# Future APIs

Authentication

Organizations

Saved Dashboards

Templates

Notifications

Scheduling

Cloud Storage

---

End of Document