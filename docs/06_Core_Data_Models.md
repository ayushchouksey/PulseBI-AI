# 06_Core_Data_Models

Version 1.0

---

# Purpose

This document defines every JSON model used throughout PulseBI AI.

All frontend components, backend modules, AI providers, and export modules must use these models.

These contracts are the single source of truth.

Changing these contracts requires updating every dependent module.

---

# 1 Dataset Model

Represents one uploaded dataset.

{
    "id": "uuid",
    "name": "sales.csv",
    "size": 248392,
    "rows": 12540,
    "columns": 12,
    "uploadedAt": "ISO Date",
    "status": "READY"
}

Status

UPLOADING

PARSING

METADATA

READY

ERROR

---

# 2 Column Metadata

Represents one CSV column.

{
    "id":"uuid",

    "originalName":"Revenue",

    "displayName":"Revenue",

    "dataType":"currency",

    "businessRole":"metric",

    "aggregation":"SUM",

    "visible":true,

    "confidence":98,

    "nullable":false,

    "unique":false,

    "sampleValues":[
        "1200",
        "1450",
        "1800"
    ]
}

---

Supported Data Types

text

number

currency

percentage

date

datetime

boolean

email

phone

url

unknown

---

Business Roles

metric

dimension

date

identifier

location

category

ignore

---

Aggregations

SUM

AVG

COUNT

COUNT_DISTINCT

MIN

MAX

NONE

---

# 3 Metadata Response

{
    "datasetId":"uuid",

    "columns":[
        {}
    ],

    "warnings":[

    ],

    "errors":[

    ]
}

---

# 4 Dataset Statistics

{
    "datasetId":"uuid",

    "rowCount":12000,

    "columnCount":15,

    "missingValues":20,

    "duplicateRows":0,

    "generatedAt":"ISO Date"
}

---

# 5 Metric Summary

{
    "column":"Revenue",

    "sum":120000,

    "average":120,

    "minimum":10,

    "maximum":500,

    "median":118,

    "count":1200,

    "stdDeviation":25,

    "variance":12
}

---

# 6 Trend Model

{
    "dimension":"Month",

    "metric":"Revenue",

    "values":[

    ]
}

---

# 7 Dashboard Model

{
    "dashboardId":"uuid",

    "title":"Sales Dashboard",

    "description":"Auto Generated Dashboard",

    "createdAt":"ISO Date",

    "widgets":[ ],

    "filters":[ ],

    "layout":{ },

    "theme":"default"
}

---

# 8 Widget Model

{
    "id":"uuid",

    "title":"Revenue by Month",

    "type":"chart",

    "chartType":"line",

    "position":{

        "x":0,

        "y":0,

        "w":6,

        "h":4

    },

    "dataSource":"trend",

    "configuration":{ },

    "exportable":true,

    "visible":true
}

---

Widget Types

KPI

Chart

Table

Summary

Text

Filter

---

# 9 KPI Model

{
    "title":"Revenue",

    "value":120000,

    "format":"currency",

    "change":"+12%",

    "trend":"up"
}

---

# 10 Chart Model

{
    "id":"uuid",

    "chartType":"bar",

    "title":"Revenue by Region",

    "xAxis":"Region",

    "yAxis":"Revenue",

    "aggregation":"SUM",

    "filters":[ ],

    "plotlyConfig":{ }
}

---

Supported Charts

Line

Bar

Pie

Area

Scatter

Heatmap

Treemap

Histogram

Box Plot

Gauge

Waterfall

---

# 11 Filter Model

{
    "id":"uuid",

    "field":"Region",

    "type":"dropdown",

    "values":[ ],

    "selected":[ ]
}

---

# 12 Table Model

{
    "columns":[ ],

    "rows":[ ],

    "pagination":{

    }
}

---

# 13 AI Request

{
    "question":"Show revenue by region",

    "dashboardContext":{ },

    "metadata":{ },

    "statistics":{ }
}

---

# 14 AI Response

{
    "type":"dashboard_action",

    "summary":"West region generated highest revenue.",

    "actions":[ ]
}

---

# 15 Dashboard Action

{
    "type":"CREATE_CHART",

    "parameters":{

    }
}

---

Supported Actions

CREATE_CHART

DELETE_CHART

UPDATE_CHART

FILTER

SORT

EXPORT

ANSWER

ADD_KPI

REMOVE_WIDGET

RESIZE_WIDGET

MOVE_WIDGET

---

# 16 Export Model

{
    "format":"pdf",

    "target":"dashboard",

    "filtersApplied":true
}

Supported Formats

PNG

PDF

CSV

Excel

SVG

---

# 17 API Response

{
    "success":true,

    "data":{ },

    "message":"Success",

    "errors":[ ],

    "requestId":"uuid",

    "timestamp":"ISO Date"
}

Every backend endpoint must follow this response format.

---

# 18 Error Model

{
    "code":"CSV_001",

    "message":"Invalid CSV",

    "details":"Duplicate headers detected.",

    "suggestion":"Please ensure every column has a unique name."
}

---

# 19 Conversation Context

{
    "conversationId":"uuid",

    "history":[ ],

    "dashboardContext":{ }
}

This object is sent to the AI provider.

---

# 20 Theme Model

{
    "mode":"light",

    "primaryColor":"#2563EB",

    "radius":"16",

    "font":"Inter"
}

---

End of Document