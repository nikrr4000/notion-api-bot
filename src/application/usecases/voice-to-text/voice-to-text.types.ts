import { UseCaseResult, UseCaseStatus } from "../shared/types.js";
import { VoiceRecognitionResult } from "#domain/models/voice-recognition/voice-recognition.model.js";
import { RecognitionService } from "../../services/recognition.service.js";
import { StorageService } from "../../services/storage.service.js";
import { EventBus } from "../../interfaces/events/event-bus.interface.js";

export interface VoiceToTextParams {
    voiceUrl: string;
    userId: string;
    language?: string;
    saveToStorage?: boolean;
}

export interface VoiceToTextResult {
    requestId: string;
    operationId?: string;
    text: string | null;
    status: UseCaseStatus;
    storageUrl?: string;
    result?: VoiceRecognitionResult;
}

export interface VoiceToTextDependencies {
    recognitionService: RecognitionService;
    storageService: StorageService;
    eventBus: EventBus;
}

export type VoiceToTextUseCaseResult = UseCaseResult<VoiceToTextResult>;

export type VoiceToTextUseCase = (params: VoiceToTextParams) => Promise<VoiceToTextUseCaseResult>;
