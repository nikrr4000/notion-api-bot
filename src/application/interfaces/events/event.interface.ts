export interface Event {
    readonly type: string;
    readonly timestamp: Date;
    readonly payload: unknown;
}

export interface DomainEvent<T = unknown> extends Event {
    readonly aggregateId: string;
    readonly payload: T;
}

export interface IntegrationEvent<T = unknown> extends Event {
    readonly source: string;
    readonly destination?: string;
    readonly payload: T;
}
