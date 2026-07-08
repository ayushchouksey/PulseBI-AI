export class HeaderValidator {
    execute(dataset) {
        const issues = [];
        const seen = new Set();
        dataset.headers.forEach((header, index) => {
            const value = header.trim();
            if (!value) {
                issues.push({
                    severity: "error",
                    code: "DQ001",
                    message: `Column ${index + 1} has an empty header.`,
                });
                return;
            }
            const normalized = value.toLowerCase();
            if (seen.has(normalized)) {
                issues.push({
                    severity: "error",
                    code: "DQ002",
                    message: `Duplicate header "${value}".`,
                });
            }
            seen.add(normalized);
        });
        return issues;
    }
}
//# sourceMappingURL=HeaderValidator.js.map