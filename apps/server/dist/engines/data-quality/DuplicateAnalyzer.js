export class DuplicateAnalyzer {
    execute(dataset) {
        const seen = new Set();
        let duplicates = 0;
        for (const row of dataset.rows) {
            const key = JSON.stringify(row);
            if (seen.has(key)) {
                duplicates++;
            }
            else {
                seen.add(key);
            }
        }
        return duplicates;
    }
}
//# sourceMappingURL=DuplicateAnalyzer.js.map