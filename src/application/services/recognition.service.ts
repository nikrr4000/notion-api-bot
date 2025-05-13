import { EventBus } from "../interfaces/events/event-bus.interface.js";
import { SpeechRecognitionService } from "../interfaces/recognition.interface.js";
import {
    RecognitionConfigBase,
    RecognitionAudioBase,
    VoiceRecognitionResult,
    VoiceRecognitionPending,
} from "#domain/models/voice-recognition/voice-recognition.model.js";
import { VoiceRecognitionEventFactory } from "../factories/voice-recognition-event.factory.js";
import { ServiceFactory } from "./types.js";

export interface RecognitionServiceDependencies {
    speechRecognition: SpeechRecognitionService;
    eventBus: EventBus;
}

export interface RecognitionService {
    startRecognition(audioUri: string, language?: string): Promise<VoiceRecognitionPending>;

    getRecognitionStatus(requestId: string, operationId: string): Promise<VoiceRecognitionResult>;

    getRecognitionText(result: VoiceRecognitionResult): string | null;

    recognizeAudio(
        audioUri: string,
        language?: string,
    ): Promise<{ text: string | null; result: VoiceRecognitionResult }>;
}

export const createRecognitionService: ServiceFactory<RecognitionService, RecognitionServiceDependencies> = ({
    speechRecognition,
    eventBus,
}) => {
    return {
        async startRecognition(audioUri, language = "ru-RU") {
            const audio: RecognitionAudioBase = { uri: audioUri };
            const config: RecognitionConfigBase = { language };
            const requestId = crypto.randomUUID();

            const createdRequest = await speechRecognition.createRecognitionRequest(requestId, config, audio);

            await eventBus.publish(
                VoiceRecognitionEventFactory.createVoiceRecognitionStartedEvent(createdRequest),
            );

            const pendingRequest = await speechRecognition.registerRecognitionRequest(createdRequest);

            return pendingRequest;
        },

        async getRecognitionStatus(requestId: string, operationId: string) {
            return speechRecognition.getOperationStatus(requestId, operationId);
        },

        getRecognitionText(result) {
            if (result.status !== "done" || "error" in result) {
                return null;
            }

            return result.result
                .map((chunk) => chunk.text)
                .join(" ")
                .trim();
        },

        async recognizeAudio(audioUri, language) {
            const result = await speechRecognition.recognizeSpeech(
                { uri: audioUri },
                language ? { language } : undefined,
            );

            const text = this.getRecognitionText(result);

            return { text, result };
        },
    };
};
