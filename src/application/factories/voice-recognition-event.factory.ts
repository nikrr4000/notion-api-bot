import { EventType } from "#domain/events/base-event.js";
import {
    VoiceRecordCreatedEvent,
    VoiceRecognitionStartedEvent,
    VoiceRecognitionCompletedEvent,
    VoiceRecognitionFailedEvent,
} from "#domain/events/voice-recognition.events.js";
import {
    VoiceRecognitionCreated,
    VoiceRecognitionDone,
    VoiceRecognitionError,
} from "#domain/models/voice-recognition/voice-recognition.model.js";

export class VoiceRecognitionEventFactory {
    static createVoiceRecordCreatedEvent(
        id: string,
        metadata?: Record<string, unknown>,
    ): VoiceRecordCreatedEvent {
        return {
            type: EventType.VOICE_RECORD_CREATED,
            timestamp: new Date(),
            aggregateId: id,
            payload: {
                id,
            },
            metadata,
        };
    }

    static createVoiceRecognitionStartedEvent(
        recognition: VoiceRecognitionCreated,
        metadata?: Record<string, unknown>,
    ): VoiceRecognitionStartedEvent {
        return {
            type: EventType.VOICE_RECOGNITION_STARTED,
            timestamp: new Date(),
            aggregateId: recognition.id,
            payload: {
                recognition,
            },
            metadata,
        };
    }

    static createVoiceRecognitionCompletedEvent(
        recognition: VoiceRecognitionDone,
        metadata?: Record<string, unknown>,
    ): VoiceRecognitionCompletedEvent {
        return {
            type: EventType.VOICE_RECOGNITION_COMPLETED,
            timestamp: new Date(),
            aggregateId: recognition.id,
            payload: {
                recognition,
            },
            metadata,
        };
    }

    static createVoiceRecognitionFailedEvent(
        recognition: VoiceRecognitionError,
        metadata?: Record<string, unknown>,
    ): VoiceRecognitionFailedEvent {
        return {
            type: EventType.VOICE_RECOGNITION_FAILED,
            timestamp: new Date(),
            aggregateId: recognition.id,
            payload: {
                recognition,
            },
            metadata,
        };
    }
}
