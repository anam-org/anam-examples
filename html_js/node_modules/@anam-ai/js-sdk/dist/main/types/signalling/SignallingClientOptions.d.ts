export interface SignallingURLOptions {
    baseUrl: string;
    protocol?: string;
    port?: string;
    signallingPath?: string;
}
export interface SignallingClientOptions {
    heartbeatIntervalSeconds?: number;
    maxWsReconnectionAttempts?: number;
    url: SignallingURLOptions;
}
//# sourceMappingURL=SignallingClientOptions.d.ts.map