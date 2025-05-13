export enum EventType {
    VOICE_RECORD_CREATED = "voice.record.created",
    VOICE_RECOGNITION_STARTED = "voice.recognition.started",
    VOICE_RECOGNITION_COMPLETED = "voice.recognition.completed",
    VOICE_RECOGNITION_FAILED = "voice.recognition.failed",

    FILE_UPLOADED = "file.uploaded",
    SCHEMA_DETECTED = "schema.detected",
    DOCUMENT_CREATED = "document.created",
}

export type EventPayload = Record<string, unknown>;

export interface BaseEvent {
    readonly type: EventType;
    readonly timestamp: Date;
    readonly metadata?: Record<string, unknown>;
}
