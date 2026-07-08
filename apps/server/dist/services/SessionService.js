export class SessionService {
    sessions = new Map();
    createSession() {
        const id = crypto.randomUUID();
        this.sessions.set(id, {});
        return id;
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    deleteSession(id) {
        this.sessions.delete(id);
    }
}
//# sourceMappingURL=SessionService.js.map