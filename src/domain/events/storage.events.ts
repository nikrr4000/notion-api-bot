import { BaseEvent, EventType } from "./base-event.js";

export interface FileUploadedEvent extends BaseEvent {
    readonly type: EventType.FILE_UPLOADED;
    readonly aggregateId: string;
    readonly payload: {
        readonly uploadedFile: {
            readonly filePath: string;
            readonly publicUrl: string;
            readonly sourceUrl: string;
        };
    };
}

export type VoiceRecognitionEvent = FileUploadedEvent;
