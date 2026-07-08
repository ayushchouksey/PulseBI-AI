import Papa from "papaparse";
export class CsvParser {
    parse(buffer, delimiter) {
        const csvContent = buffer.toString("utf-8");
        const result = Papa.parse(csvContent, {
            delimiter,
            skipEmptyLines: true,
            dynamicTyping: false,
            transform: (value) => value.trim(),
        });
        if (result.errors.length > 0) {
            throw new Error(result.errors[0].message);
        }
        const data = result.data;
        if (data.length === 0) {
            throw new Error("CSV file contains no data.");
        }
        const headers = data[0];
        const rows = data.slice(1);
        return {
            headers,
            rows,
            rowCount: rows.length,
        };
    }
}
//# sourceMappingURL=CsvParser.js.map