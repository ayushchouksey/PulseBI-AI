# 08_Data_Quality_Engine

Version: 1.0

---

# Purpose

The Data Quality Engine is responsible for validating, profiling, and assessing the quality of the uploaded dataset before any business analysis begins.

It ensures that downstream engines receive reliable and consistent data.

This engine must not modify business values unless explicitly configured.

Its responsibility is to identify issues, generate warnings, and prepare the dataset for Metadata Detection.

No AI or LLM should participate in this stage.

---

# Responsibilities

The engine is responsible for:

Validate dataset

Profile dataset

Measure data quality

Detect anomalies

Generate warnings

Generate errors

Generate recommendations

Compute quality score

Forward validated dataset to Metadata Engine

---

# Processing Flow

Dataset

↓

Structure Validation

↓

Header Validation

↓

Row Validation

↓

Column Validation

↓

Duplicate Detection

↓

Missing Value Analysis

↓

Outlier Detection

↓

Data Profiling

↓

Quality Score

↓

Warnings

↓

Validated Dataset

↓

Metadata Engine

---

# Validation Categories

1. File Validation

2. Header Validation

3. Row Validation

4. Column Validation

5. Value Validation

6. Data Quality Rules

7. Business Warnings

8. Dataset Summary

---

# File Validation

Validate

File exists

Supported extension

Readable format

Maximum size

Maximum rows

Maximum columns

Reject if any mandatory check fails.

---

# Header Validation

Each column must

Have a name

Be unique

Contain printable characters

Not exceed 100 characters

Trim whitespace automatically.

Reject duplicate names.

---

# Row Validation

Each row should

Contain correct number of columns

Not exceed maximum length

Preserve original order

Rows with inconsistent column counts should be reported.

---

# Missing Values

Compute

Missing values per column

Missing percentage

Overall completeness

Example

Revenue

2 missing values

0.2%

This is a warning, not an error.

---

# Duplicate Rows

Detect

Exact duplicates

Near duplicates (future)

Output

Duplicate count

Duplicate percentage

Sample duplicate row IDs

---

# Empty Columns

Detect columns where every value is null or empty.

Recommendation

Ignore this column during dashboard generation.

---

# Constant Columns

Detect columns where every row contains the same value.

Example

Country

India

India

India

India

Recommendation

Hide from dashboard suggestions.

---

# High Cardinality Columns

Detect columns with many unique values.

Examples

Email

UUID

Invoice Number

Recommendation

Treat as Identifier.

Avoid charts.

---

# Numeric Validation

For numeric columns

Detect

Negative values

Decimals

Very large numbers

Scientific notation

Invalid numeric values

Generate warnings where appropriate.

---

# Currency Validation

Detect

Currency symbols

Mixed currencies

Negative currency

Invalid formatting

Examples

₹1200

$200

€500

Warn if multiple currencies exist.

---

# Date Validation

Detect

Invalid dates

Future dates

Impossible dates

Mixed date formats

Examples

2025-01-10

10/01/2025

Jan-10-2025

Recommendation

Normalize during Metadata Engine.

---

# Boolean Validation

Recognize

true

false

yes

no

1

0

Y

N

---

# Text Validation

Detect

Very long text

HTML tags

JavaScript snippets

Special characters

Potential malicious input

---

# Outlier Detection

For numeric columns

Compute

Minimum

Maximum

Quartiles

IQR

Potential outliers

Output warning only.

Never remove values automatically.

---

# Business Warnings

Examples

Revenue contains negative values.

Profit column has 40% missing data.

Order Date contains future dates.

Region column has only one unique value.

Warnings should not block dashboard generation.

---

# Fatal Errors

Duplicate headers

Unreadable CSV

Corrupted rows

Missing mandatory headers

Unsupported encoding

File too large

These prevent processing.

---

# Data Quality Score

Generate a score from 0–100.

Example calculation

Completeness

30%

Consistency

25%

Duplicates

15%

Formatting

15%

Validity

15%

Output

92/100

Quality Level

Excellent

Good

Fair

Poor

---

# Quality Report

Generate

Dataset Summary

Warnings

Errors

Recommendations

Quality Score

This report is shown before Metadata Confirmation.

---

# Recommendation Engine

Generate suggestions such as

Rename duplicate headers.

Ignore empty columns.

Review negative revenue values.

Confirm mixed date formats.

Hide constant columns.

These are suggestions only.

---

# Error Codes

DQ001

Duplicate Headers

DQ002

Missing Header

DQ003

Corrupted Row

DQ004

Invalid Encoding

DQ005

File Too Large

DQ006

Too Many Columns

DQ007

Too Many Rows

DQ008

Unreadable File

---

# Output Contract

The engine produces

Validated Dataset

Quality Report

Warnings

Errors

Quality Score

No metadata.

No statistics.

No charts.

---

# Performance

Validation

<2 seconds

Profiling

<2 seconds

Quality Report

Instant after profiling

---

# Logging

Log

Validation time

Warnings count

Errors count

Quality score

Dataset size

---

# Future Enhancements

Detect personally identifiable information (PII)

Detect sensitive business fields

Automatic data masking

Duplicate clustering

Schema validation

Cross-column validation

Custom validation rules

---

# Success Criteria

Every uploaded dataset should receive:

Validation status

Quality score

Warnings

Recommendations

Validated dataset

before Metadata Detection begins.

---

End of Document