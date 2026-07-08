export declare class SessionService {
    private sessions;
    createSession(): `${string}-${string}-${string}-${string}-${string}`;
    getSession(id: string): any;
    deleteSession(id: string): void;
}
