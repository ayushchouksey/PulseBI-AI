export class DisplayNameGenerator {
    execute(columnName) {
        return columnName
            .replace(/[_-]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, character => character.toUpperCase());
    }
}
//# sourceMappingURL=DisplayNameGenerator.js.map