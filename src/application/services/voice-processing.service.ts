// application/services/voice-processing.service.ts
import { RecognitionService } from "./recognition.service.js";
import { StorageService } from "./storage.service.js";
// import { AppDocumentService } from './document.service.js';
import { EventBus } from "../interfaces/events/event-bus.interface.js";
import { VoiceRecognitionEventFactory } from "../factories/voice-recognition-event.factory.js";
import { ServiceFactory } from "./types.js";
import { VoiceRecognitionError } from "#domain/models/index.js";

export interface VoiceProcessingDependencies {
    recognition: RecognitionService;
    storage: StorageService;
    //   document: AppDocumentService;
    eventBus: EventBus;
}

export interface VoiceProcessingService {
    processVoiceMessage(
        voiceUrl: string,
        userId: string,
        metadata?: Record<string, any>,
    ): Promise<{
        operationId: string;
        storageUrl: string | null;
    }>;

    completeVoiceProcessing(
        operationId: string,
        userId: string,
        title?: string,
    ): Promise<{
        text: string | null;
        documentId: string | null;
    }>;

    processVoiceToDocument(
        voiceUrl: string,
        userId: string,
        title: string,
        metadata?: Record<string, any>,
    ): Promise<{
        text: string | null;
        documentId: string | null;
    }>;
}

export const createVoiceProcessingService: ServiceFactory<
    VoiceProcessingService,
    VoiceProcessingDependencies
> = ({ recognition, storage, eventBus }) => {
    return {
        async processVoiceMessage(voiceUrl, userId, metadata = {}) {
            const storageResult = await storage.uploadFromUrl(voiceUrl, `voices/${userId}/${Date.now()}`);

            if (!storageResult.success) {
                throw new Error(`Failed to upload voice file: ${storageResult.error}`);
            }

            const pendingRecognition = await recognition.startRecognition(
                storageResult.publicUrl!,
                metadata.language,
            );

            return {
                operationId: pendingRecognition.operationId,
                storageUrl: storageResult.publicUrl,
            };
        },

        async completeVoiceProcessing(
            requestId: string,
            operationId: string,
            userId: string,
            title = "Voice Recognition",
        ) {
            const recognitionResult = await recognition.getRecognitionStatus(requestId, operationId);

            const text = recognition.getRecognitionText(recognitionResult);

            if (!text) {
                await eventBus.publish(
                    VoiceRecognitionEventFactory.createVoiceRecognitionFailedEvent(
                        recognitionResult as VoiceRecognitionError,
                        "No text was recognized",
                        userId,
                    ),
                );

                return { text: null, documentId: null };
            }

            //   const documentResult = await document.createDocumentFromRecognition(
            //     text,
            //     title,
            //     { userId, operationId, recognized_at: new Date().toISOString() }
            //   );

            //   await eventBus.publish(
            //     EventFactory.createVoiceToDocumentCompletedEvent(
            //       operationId,
            //       documentResult.id,
            //       userId
            //     )
            //   );

            return {
                text,
                documentId: text,
            };
        },

        async processVoiceToDocument(voiceUrl, userId, title, metadata = {}) {
            const { operationId } = await this.processVoiceMessage(voiceUrl, userId, metadata);

            return this.completeVoiceProcessing(operationId, userId, title);
        },
    };
};
