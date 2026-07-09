export class ExportEngine {
    execute(dashboard) {
        return Buffer.from(JSON.stringify(dashboard, null, 2));
    }
}
//# sourceMappingURL=ExportEngine.js.map