export class SessionContextManager {
    sessions = new Map();
    create(context) {
        this.sessions.set(context.dataset.id, context);
    }
    get(datasetId) {
        return this.sessions.get(datasetId);
    }
    update(datasetId, context) {
        this.sessions.set(datasetId, context);
    }
    delete(datasetId) {
        this.sessions.delete(datasetId);
    }
    clear() {
        this.sessions.clear();
    }
}
//# sourceMappingURL=SessionContextManager.js.map