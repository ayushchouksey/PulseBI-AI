export class SessionService {

    private sessions = new Map();
  
    public createSession() {
  
      const id = crypto.randomUUID();
  
      this.sessions.set(id, {});
  
      return id;
  
    }
  
    public getSession(id: string) {
  
      return this.sessions.get(id);
  
    }
  
    public deleteSession(id: string) {
  
      this.sessions.delete(id);
  
    }
  
  }