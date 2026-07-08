export class DisplayNameGenerator {
    execute(columnName: string): string {
      return columnName
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, character => character.toUpperCase());
    }
  }