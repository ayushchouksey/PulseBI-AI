# 09_Business_Intelligence_Understanding_Engine

Version 1.0

---

# Purpose

The Business Intelligence Understanding Engine (BIUE) is responsible for transforming a validated dataset into business knowledge.

Unlike traditional metadata generators that only identify data types, BIUE understands the semantic meaning of the data and prepares it for dashboard generation.

It should answer questions such as:

What does this column represent?

Is it a KPI?

Can this be filtered?

Can this be charted?

What business questions can it answer?

The output of this engine becomes the foundation for every other module.

---

# Responsibilities

The BIUE is responsible for:

Data type detection

Business semantic detection

Display name generation

Aggregation recommendation

KPI detection

Dimension detection

Identifier detection

Date hierarchy detection

Geographic detection

Chart suitability scoring

Relationship discovery

Business glossary generation

Confidence scoring

User override support

---

# Processing Pipeline

Validated Dataset

↓

Column Profiling

↓

Type Detection

↓

Semantic Detection

↓

Business Role Assignment

↓

Aggregation Recommendation

↓

Chart Suitability Analysis

↓

Relationship Discovery

↓

Business Glossary

↓

Metadata JSON

↓

Dashboard Recommendation Engine

---

# Step 1 – Column Profiling

For every column compute:

Column name

Unique value count

Null percentage

Minimum value

Maximum value

Average length

Sample values

Data distribution

Cardinality

This information is used throughout the engine.

---

# Step 2 – Data Type Detection

Supported Types

Text

Integer

Decimal

Currency

Percentage

Boolean

Date

DateTime

Email

Phone

URL

Location

Unknown

Detection should use:

Column name

Sample values

Entire column profile

Never rely only on the first row.

---

# Step 3 – Business Semantic Detection

Infer the business meaning of each column.

Examples

Revenue

Sales

Turnover

Amount

GMV

→ Revenue Metric

Profit

Margin

Net Profit

Gross Profit

→ Profit Metric

Qty

Quantity

Units

Pieces

→ Quantity

Customer

Customer Name

Client

Buyer

→ Customer

SKU

Product

Product Name

Item

→ Product

Region

Country

State

City

→ Geography

Order Date

Invoice Date

Created Date

Purchase Date

→ Business Date

Invoice Number

Order ID

Reference Number

→ Transaction Identifier

The engine should maintain a semantic dictionary that can be expanded over time.

---

# Step 4 – Display Name Generation

Convert technical headers into user-friendly labels.

Examples

cust_nm

↓

Customer Name

sales_amt

↓

Sales Amount

inv_dt

↓

Invoice Date

Display names should be title-cased and readable.

---

# Step 5 – Business Role Assignment

Every column must receive one business role.

Supported Roles

Metric

Dimension

Date

Identifier

Location

Category

Text

Ignore

Exactly one role per column.

---

# Step 6 – Aggregation Recommendation

Recommend the default aggregation.

SUM

AVG

COUNT

COUNT DISTINCT

MIN

MAX

NONE

Examples

Revenue

SUM

Profit

SUM

Age

AVG

Customer ID

COUNT DISTINCT

Product Name

NONE

---

# Step 7 – KPI Detection

Automatically identify business KPIs.

Potential KPIs

Revenue

Profit

Sales

Orders

Customers

Quantity

Margin

Conversion

Growth

The engine should assign a KPI confidence score.

---

# Step 8 – Date Hierarchy Detection

If a date column exists, generate derived hierarchy levels.

Year

Quarter

Month

Week

Day

These should be available for charts and filters.

---

# Step 9 – Geographic Detection

Recognize:

Country

State

Province

Region

City

Postal Code

Future versions may support maps.

---

# Step 10 – Relationship Discovery

Infer logical relationships.

Examples

Order ID

↓

Customer

↓

Revenue

↓

Date

These relationships help AI answer complex questions.

No explicit joins are required in Version 1.

---

# Step 11 – Chart Suitability Scoring

Every column receives a suitability score for each chart type.

Example

Revenue

Bar Chart

98

Line Chart

95

Pie Chart

65

Scatter Plot

10

Product

Bar Chart

90

Pie Chart

88

Line Chart

20

This scoring guides the Dashboard Recommendation Engine.

---

# Step 12 – Filter Suitability

Determine whether a column should become a dashboard filter.

Examples

Region

Yes

Category

Yes

Date

Yes

Revenue

No

Customer ID

No

---

# Step 13 – Business Glossary

Generate simple business descriptions.

Revenue

"The total money earned from sales."

Margin

"The percentage of profit after costs."

SKU

"A unique identifier for a product."

This glossary can be used for tooltips and AI explanations.

---

# Step 14 – Confidence Scoring

Every detected property must include a confidence score.

Range

0–100

Example

Revenue

Semantic Meaning

98

Aggregation

100

Business Role

99

Display Name

100

Columns with confidence below 70 should be highlighted in the Metadata Confirmation screen.

---

# Step 15 – User Overrides

Users may modify:

Display Name

Business Role

Aggregation

Visibility

Data Type

Overrides must take precedence over automatic detection.

---

# Metadata Output

Generate a Metadata JSON object conforming to the Core Data Models specification.

This object becomes the single source of truth for all downstream engines.

---

# Performance

Target execution time

<2 seconds for datasets up to 100,000 rows.

---

# Logging

Record:

Execution time

Detected KPIs

Detected Dates

Detected Geography

Confidence distribution

User overrides

---

# Future Enhancements

Industry-specific dictionaries

Healthcare

Finance

Retail

Manufacturing

Machine-learning-assisted semantic detection

Multilingual header detection

Custom business dictionaries

---

# Success Criteria

For every uploaded dataset the engine should:

Understand business meaning

Assign correct business roles

Recommend aggregations

Identify KPIs

Generate user-friendly labels

Produce confidence scores

Generate metadata ready for dashboard generation

without requiring technical input from the user.

---

End of Document