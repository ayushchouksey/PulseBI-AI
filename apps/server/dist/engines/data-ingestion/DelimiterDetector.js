export class DelimiterDetector {
    delimiters = [
        ",",
        ";",
        "|",
        "\t",
    ];
    detect(buffer) {
        const sample = buffer
            .toString("utf-8")
            .split(/\r?\n/)
            .slice(0, 10)
            .join("\n");
        let selectedDelimiter = ",";
        let highestScore = -1;
        for (const delimiter of this.delimiters) {
            const occurrences = sample.split(delimiter).length - 1;
            if (occurrences > highestScore) {
                highestScore = occurrences;
                selectedDelimiter = delimiter;
            }
        }
        return selectedDelimiter;
    }
}
//# sourceMappingURL=DelimiterDetector.js.map