# 07_Data_Ingestion_Engine

Version 1.0

---

# Purpose

The Data Ingestion Engine is responsible for accepting uploaded business datasets and transforming them into a standardized internal representation.

It is the only module allowed to read raw uploaded files.

All downstream modules consume structured data produced by this engine.

The engine must be deterministic.

No AI or LLM should participate in this stage.

---

# Responsibilities

The Data Ingestion Engine is responsible for:

Accepting uploaded files

Reading CSV files

Parsing rows

Parsing headers

Detecting encoding

Handling delimiters

Normalizing values

Generating dataset object

Forwarding data to Validation Engine

---

# Supported File Types

Initial Version

✓ CSV (.csv)

Future Versions

Excel (.xlsx)

Google Sheets

JSON

REST API

Database Connections

---

# Upload Workflow

User selects CSV

↓

File Upload

↓

Temporary Storage

↓

Read File

↓

Parse Headers

↓

Parse Rows

↓

Normalize Values

↓

Generate Dataset Object

↓

Pass to Validation Engine

---

# Upload Limits

Maximum File Size

50 MB

Maximum Rows

100,000

Maximum Columns

500

Maximum Cell Length

10,000 characters

Reject files exceeding these limits.

---

# File Validation

Reject if

File is empty

Extension is unsupported

File exceeds maximum size

Headers are missing

Rows cannot be parsed

Encoding is unsupported

---

# CSV Parsing Rules

The parser must support

Quoted values

Escaped quotes

Commas inside values

Empty values

UTF-8 encoding

Windows line endings

Unix line endings

---

# Delimiter Detection

Automatically detect

Comma

Semicolon

Tab

Pipe

If detection fails,

default to comma.

---

# Header Detection

The first row must always represent headers.

Headers should be trimmed.

Duplicate spaces removed.

Example

" Revenue "

↓

Revenue

---

# Duplicate Headers

Reject duplicate column names.

Example

Revenue

Revenue

↓

Validation Error

---

# Empty Headers

Reject

Example

Revenue,,Profit

↓

Validation Error

---

# Row Processing

Each row should become

{
    rowId,

    values
}

Rows must preserve original order.

---

# Value Normalization

Trim whitespace.

Convert empty strings to null.

Preserve original formatting for text.

Do not perform type conversion.

Type detection belongs to Metadata Engine.

---

# Dataset Object

Generate

{
    datasetId,

    headers,

    rows,

    metadata:null,

    statistics:null
}

---

# Progress States

The frontend should display

Uploading

Reading File

Parsing

Normalizing

Completed

---

# Error Handling

Possible Errors

Unsupported file

Corrupted CSV

Missing header

Duplicate headers

Invalid delimiter

Encoding failure

Large file

Each error should include

Reason

Suggested fix

Retry option

---

# Performance

Files under 10MB

<1 second

Files under 50MB

<3 seconds

Use streaming when possible.

Avoid loading unnecessary copies into memory.

---

# Memory Management

The engine should avoid multiple copies of the dataset.

Use immutable transformations only when required.

Release temporary objects after parsing.

---

# Logging

Log

Upload time

Parse time

Dataset size

Row count

Column count

Validation status

Errors

---

# Security

Reject executable files.

Reject hidden file extensions.

Sanitize filenames.

Never execute uploaded content.

Escape malicious values.

Treat uploaded data as untrusted.

---

# Output Contract

The engine produces a Dataset object.

It never produces metadata.

It never generates statistics.

It never creates dashboards.

Its responsibility ends after successful parsing.

---

# Future Extensibility

Future adapters

CSV Adapter

Excel Adapter

Google Sheets Adapter

Database Adapter

API Adapter

Each adapter should implement a common interface.

The rest of the application must remain unaware of the data source.

---

# Success Criteria

A valid CSV should be converted into a structured Dataset object with:

Headers

Rows

Dataset metadata

Upload information

Ready for Validation Engine

No business logic should be performed in this engine.

---

End of Document