import { BaseEvent, EventType } from "./base-event.js";
import { VoiceRecognitionCreated, VoiceRecognitionError, VoiceRecognitionDone } from "../models/index.js";

export interface VoiceRecordCreatedEvent extends BaseEvent {
    readonly type: EventType.VOICE_RECORD_CREATED;
    readonly aggregateId: string;
    readonly payload: {
        readonly id: string;
    };
}

export interface VoiceRecognitionStartedEvent extends BaseEvent {
    readonly type: EventType.VOICE_RECOGNITION_STARTED;
    readonly aggregateId: string;
    readonly payload: {
        readonly recognition: VoiceRecognitionCreated;
    };
}

export interface VoiceRecognitionCompletedEvent extends BaseEvent {
    readonly type: EventType.VOICE_RECOGNITION_COMPLETED;
    readonly aggregateId: string;
    readonly payload: {
        readonly recognition: VoiceRecognitionDone;
    };
}

export interface VoiceRecognitionFailedEvent extends BaseEvent {
    readonly type: EventType.VOICE_RECOGNITION_FAILED;
    readonly aggregateId: string;
    readonly payload: {
        readonly recognition: VoiceRecognitionError;
    };
}

export type VoiceRecognitionEvent =
    | VoiceRecordCreatedEvent
    | VoiceRecognitionStartedEvent
    | VoiceRecognitionCompletedEvent
    | VoiceRecognitionFailedEvent;
