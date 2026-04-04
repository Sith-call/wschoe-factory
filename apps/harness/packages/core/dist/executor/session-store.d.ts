export declare class SessionStore {
    private sessions;
    load(harnessDir: string): Promise<void>;
    save(harnessDir: string): Promise<void>;
    set(stepId: string, claudeSessionId: string): void;
    get(stepId: string): string | undefined;
    getLatest(): string | undefined;
}
//# sourceMappingURL=session-store.d.ts.map