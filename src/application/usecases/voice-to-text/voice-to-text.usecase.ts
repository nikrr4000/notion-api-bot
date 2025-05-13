import {
    VoiceToTextParams,
    VoiceToTextDependencies,
    VoiceToTextUseCaseResult,
    VoiceToTextUseCase,
} from "./voice-to-text.types.js";
import { VoiceRecognitionEventFactory } from "../../factories/voice-recognition-event.factory.js";
import * as crypto from "crypto";

export const createVoiceToTextUseCase = (dependencies: VoiceToTextDependencies): VoiceToTextUseCase => {
    const { recognitionService, storageService, eventBus } = dependencies;

    return async (params: VoiceToTextParams): Promise<VoiceToTextUseCaseResult> => {
        const { voiceUrl, userId, language, saveToStorage = true } = params;
        const requestId = crypto.randomUUID();

        try {
            const metadata = {
                userId,
                requestId,
                timestamp: new Date().toISOString(),
                source: "voice-to-text-usecase",
            };

            await eventBus.publish(
                VoiceRecognitionEventFactory.createVoiceRecordCreatedEvent(requestId, metadata),
            );

            let storageUrl = voiceUrl;

            if (saveToStorage) {
                const destinationPath = `users/${userId}/voice/${requestId}.ogg`;
                const uploadResult = await storageService.uploadFromUrl(voiceUrl, destinationPath);

                if (!uploadResult.success) {
                    throw new Error(`Failed to upload voice file: ${uploadResult.error}`);
                }

                // FIXME: delete ! and add typos to uploadResult
                storageUrl = uploadResult.publicUrl!;
            }

            const { text, result } = await recognitionService.recognizeAudio(storageUrl, language);

            const status = result.status === "done" ? "completed" : "failed";

            if (result.status === "done") {
                await eventBus.publish(
                    VoiceRecognitionEventFactory.createVoiceRecognitionCompletedEvent(
                        {
                            id: result.id,
                            status: result.status,
                            result: result.result,
                        },
                        metadata,
                    ),
                );
            } else if (result.status === "error") {
                throw new Error(result.error);
            }

            return {
                success: status !== "failed",
                data: {
                    requestId,
                    text,
                    status,
                    storageUrl,
                    result,
                },
            };
        } catch (error) {
            const err = error as Error;
            await eventBus.publish(
                VoiceRecognitionEventFactory.createVoiceRecognitionFailedEvent({
                    id: requestId,
                    status: "error",
                    error: err.message || "Unknown error",
                }),
            );

            return {
                success: false,
                error: {
                    code: "VOICE_PROCESSING_FAILED",
                    message: error instanceof Error ? error.message : "Unknown error",
                    details: error,
                },
            };
        }
    };
};
