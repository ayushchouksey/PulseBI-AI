import { randomUUID } from "node:crypto";
export class DatasetNormalizer {
    normalize(rawDataset, fileName, delimiter) {
        const rows = [];
        for (const row of rawDataset.rows) {
            const record = {};
            rawDataset.headers.forEach((header, index) => {
                record[header] = this.convertValue(row[index] ?? null);
            });
            rows.push(record);
        }
        return {
            id: randomUUID(),
            fileName,
            delimiter,
            encoding: "utf-8",
            uploadedAt: new Date(),
            headers: rawDataset.headers,
            rows,
            totalRows: rows.length,
            totalColumns: rawDataset.headers.length,
        };
    }
    convertValue(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const trimmed = value.trim();
        if (trimmed === "") {
            return null;
        }
        // Boolean
        if (trimmed.toLowerCase() === "true") {
            return true;
        }
        if (trimmed.toLowerCase() === "false") {
            return false;
        }
        // Number
        const numericValue = Number(trimmed);
        if (!Number.isNaN(numericValue) && trimmed !== "") {
            return numericValue;
        }
        // Date
        const date = new Date(trimmed);
        if (!Number.isNaN(date.getTime())) {
            return date;
        }
        // Default: String
        return trimmed;
    }
}
//# sourceMappingURL=DatasetNormalizer.js.map