# 12_Natural_Language_Processing_Layer

Version 1.0

---

# Purpose

The Natural Language Processing (NLP) Layer enables business users to interact with PulseBI AI using everyday language.

Its responsibility is to understand user intent, build the appropriate context, communicate with the configured AI provider, validate the response, and convert the result into structured dashboard actions.

The NLP Layer should never calculate business statistics.

It should rely entirely on outputs produced by the Statistics Engine.

---

# Responsibilities

The NLP Layer is responsible for:

Understanding user intent

Managing conversation history

Building prompts

Selecting AI providers

Validating AI responses

Generating dashboard actions

Generating business summaries

Explaining statistics

Handling AI failures

---

# Processing Pipeline

User Message

↓

Intent Classification

↓

Context Collection

↓

Prompt Generation

↓

AI Provider

↓

Response Validation

↓

Action Generation

↓

Dashboard Update

↓

User Response

---

# Supported User Intents

Answer Question

Generate Chart

Modify Chart

Delete Chart

Apply Filter

Clear Filter

Compare Data

Generate Summary

Recommend Visualization

Explain KPI

Export Dashboard

Reset Dashboard

Greeting

Help

Unknown

---

# Example Intents

User

"What was revenue in January?"

Intent

Answer Question

---

User

"Show revenue by region."

Intent

Generate Chart

---

User

"Replace this chart with a pie chart."

Intent

Modify Chart

---

User

"Filter only West region."

Intent

Apply Filter

---

User

"Export this dashboard."

Intent

Export Dashboard

---

# Context Builder

The Context Builder prepares information before sending it to the AI.

Include:

Metadata

Statistics

Current Dashboard

Applied Filters

Conversation History

User Overrides

Dataset Name

Never include the raw CSV.

---

# Prompt Builder

The Prompt Builder should instruct the AI to:

Answer using business language.

Never invent numerical values.

Use only supplied statistics.

Return structured JSON.

Never generate Plotly code.

Never generate SQL.

Never expose implementation details.

---

# AI Provider Interface

Every provider must implement:

generateSummary()

answerQuestion()

generateDashboardAction()

generateRecommendations()

Supported Providers

Ollama

OpenAI

Gemini

Claude

DeepSeek

Mistral

Switching providers must not affect frontend or business logic.

---

# Response Validation

Every AI response must be validated.

Checks include:

Valid JSON

Known action types

Supported chart types

No fabricated numbers

No unsupported fields

Reject invalid responses.

---

# Dashboard Actions

Supported actions:

CREATE_CHART

UPDATE_CHART

DELETE_CHART

ADD_KPI

REMOVE_KPI

APPLY_FILTER

CLEAR_FILTER

SORT_TABLE

EXPORT

RESET_DASHBOARD

ANSWER

Each action includes parameters required by the Dashboard Orchestration Engine.

---

# Conversation Memory

Maintain session-only memory.

Store:

Previous questions

Previous actions

Current filters

Current dashboard state

Do not persist conversations after the session ends.

---

# Business Summary

Generate concise summaries.

Example:

Revenue increased by 12% compared to last month.

The West region contributed 48% of total sales.

Electronics remains the highest-performing category.

Summaries should be based solely on computed statistics.

---

# Recommendations

The AI may recommend:

Useful follow-up questions

Additional charts

Potential business concerns

Interesting trends

Recommendations should never modify the dashboard automatically.

---

# Hallucination Prevention

The AI must never:

Invent KPIs

Invent revenue

Estimate values

Create unsupported charts

Reference missing columns

If the requested information does not exist, respond politely and explain why.

---

# Error Handling

Possible failures:

AI unavailable

Timeout

Malformed response

Unsupported action

Unknown intent

Provide a friendly message and preserve the current dashboard.

---

# Performance

Intent classification:

<100 ms

Prompt construction:

<50 ms

AI response:

Depends on configured provider

Response validation:

<50 ms

---

# Logging

Log:

Detected intent

Prompt size

Provider used

Response time

Validation result

Generated actions

Errors

Do not log sensitive dataset values.

---

# Future Enhancements

Voice input

Multilingual conversations

Conversation bookmarks

Suggested prompts

Proactive insights

Scheduled summaries

---

# Success Criteria

The NLP Layer should allow business users to interact naturally with their data while ensuring:

Reliable intent detection

Structured dashboard actions

Safe AI integration

Trustworthy business responses

Provider independence

No fabricated calculations

---

End of Document