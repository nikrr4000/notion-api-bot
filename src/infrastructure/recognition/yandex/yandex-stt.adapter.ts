import axios from "axios";
import * as crypto from "crypto";
import { SpeechRecognitionService } from "#application/interfaces/recognition.interface.js";
import {
    RecognitionConfigBase,
    RecognitionAudioBase,
    VoiceRecognitionResult,
    VoiceRecognitionCreated,
    VoiceRecognitionPending,
    VoiceRecognitionError,
    VoiceRecognitionDone,
} from "#domain/models/index.js";
import { config } from "../../config/config.js";
import { logger } from "../../logger/index.js";

interface YandexSTTOperationResponse {
    id: string;
    done: boolean;
    response?: {
        chunks: Array<{
            alternatives: Array<{
                text: string;
                confidence: number;
            }>;
        }>;
    };
    error?: {
        code: number;
        message: string;
        details?: any[];
    };
}

export class YandexSTTAdapter implements SpeechRecognitionService {
    private readonly apiKey: string;
    private readonly folderId: string;
    private readonly recognizeEndpoint: string =
        "https://transcribe.api.cloud.yandex.net/speech/stt/v2/longRunningRecognize";
    private readonly operationEndpoint: string = "https://operation.api.cloud.yandex.net/operations";

    constructor() {
        const { apiKey, folderId } = config.yandex;

        this.apiKey = apiKey;
        this.folderId = folderId;

        logger.info("Yandex STT adapter initialized");
    }

    async recognizeSpeech(
        audio: RecognitionAudioBase,
        config?: RecognitionConfigBase,
    ): Promise<VoiceRecognitionDone | VoiceRecognitionError> {
        const requestId = crypto.randomUUID();

        try {
            logger.info("Starting full speech recognition process", {
                requestId,
                audioUri: audio.uri,
                language: config?.language,
            });

            const recognitionRequest = await this.createRecognitionRequest(
                requestId,
                config || { language: "ru-RU" },
                audio,
            );

            const pendingRecognition = await this.registerRecognitionRequest(recognitionRequest);

            return await this.pollRecognitionResult(requestId, pendingRecognition.operationId);
        } catch (error) {
            logger.error("Speech recognition process failed", error, {
                audioUri: audio.uri,
            });

            return {
                id: requestId,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error in speech recognition process",
            };
        }
    }

    private async pollRecognitionResult(
        requestId: string,
        operationId: string,
        maxAttempts: number = 30,
        delayMs: number = 3500,
    ): Promise<VoiceRecognitionDone | VoiceRecognitionError> {
        logger.debug("Starting polling for recognition result", {
            operationId,
            maxAttempts,
            delayMs,
        });

        let attempts = 0;

        while (attempts < maxAttempts) {
            attempts++;

            const result = await this.getOperationStatus(requestId, operationId);

            if (result.status === "done" || ("error" in result && result.error)) {
                logger.info("Recognition result obtained", {
                    operationId,
                    status: result.status,
                    hasError: "error" in result && !!result.error,
                    attempts,
                });

                return result;
            }

            logger.debug("Recognition still in progress, waiting...", {
                operationId,
                attempt: attempts,
                maxAttempts,
            });

            await setTimeout(() => {}, delayMs);
        }

        logger.warn("Maximum polling attempts reached", {
            operationId,
            maxAttempts,
        });

        return {
            id: requestId,
            status: "error",
            error: `Recognition timed out after ${maxAttempts} attempts`,
        };
    }

    async createRecognitionRequest(
        requestId: string,
        config: RecognitionConfigBase,
        audio: RecognitionAudioBase,
    ): Promise<VoiceRecognitionCreated> {
        try {
            logger.debug("Creating recognition request", {
                requestId,
                audioUri: audio.uri,
                language: config.language,
            });

            return {
                id: requestId,
                status: "created",
                config,
                audio,
            };
        } catch (error) {
            logger.error("Failed to create recognition request", error);
            throw error;
        }
    }

    async registerRecognitionRequest(recognition: VoiceRecognitionCreated): Promise<VoiceRecognitionPending> {
        try {
            logger.debug("Registering recognition request with Yandex", {
                id: recognition.id,
                audioUri: recognition.audio.uri,
            });

            const requestData = {
                config: {
                    specification: {
                        languageCode: recognition.config.language || "ru-RU",
                        profanityFilter: false,
                        model: "general",
                    },
                    folderId: this.folderId,
                },
                audio: {
                    uri: recognition.audio.uri,
                },
            };

            const response = await axios.post(this.recognizeEndpoint, requestData, {
                headers: {
                    Authorization: `Api-Key ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            const operationId = response.data.id;

            logger.info("Recognition request registered with Yandex", {
                recognitionId: recognition.id,
                operationId,
            });

            return {
                id: recognition.id,
                status: "pending",
                operationId,
            };
        } catch (error) {
            logger.error("Failed to register recognition request", error, {
                recognitionId: recognition.id,
            });

            if (axios.isAxiosError(error) && error.response) {
                throw new Error(
                    `Yandex STT API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
                );
            }

            throw error;
        }
    }

    async getOperationStatus(requestId: string, operationId: string): Promise<VoiceRecognitionResult> {
        try {
            logger.debug("Checking recognition status", { operationId });

            const response = await axios.get<YandexSTTOperationResponse>(
                `${this.operationEndpoint}/${operationId}`,
                {
                    headers: {
                        Authorization: `Api-Key ${this.apiKey}`,
                    },
                },
            );
            logger.debug("Response data", response.data.response);

            const operationData = response.data;

            if (!operationData.done) {
                logger.debug("Recognition still in progress", { operationId });

                return {
                    id: requestId,
                    status: "pending",
                    operationId,
                };
            }

            if (operationData.error) {
                logger.warn("Recognition completed with error", {
                    requestId,
                    operationId,
                    error: operationData.error,
                });

                return {
                    id: requestId,
                    status: "error",
                    error: `${operationData.error.code}: ${operationData.error.message}`,
                };
            }

            if (!operationData.response) {
                logger.warn("Recognition completed but response is empty", { operationId });

                return {
                    id: requestId,
                    status: "error",
                    error: "Recognition completed but response is empty",
                };
            }

            logger.info("Recognition completed successfully", { operationId });

            const chunks = operationData.response.chunks.map((chunk) => ({
                text: chunk.alternatives[0].text,
                confidence: chunk.alternatives[0].confidence,
            }));

            return {
                id: requestId,
                status: "done",
                result: chunks,
            };
        } catch (error) {
            logger.error("Failed to get recognition result", error, { operationId });

            if (axios.isAxiosError(error) && error.response) {
                return {
                    id: requestId,
                    status: "error",
                    error: `Yandex STT API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
                };
            }

            return {
                id: requestId,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async processRecognitionResult(result: VoiceRecognitionDone): Promise<VoiceRecognitionDone> {
        try {
            logger.debug("Processing recognition result", {
                done: result.status,
                chunks: result.result,
            });

            const id = crypto.randomUUID();

            return {
                id,
                status: "done",
                result: result.result,
            };
        } catch (error) {
            logger.error("Failed to process recognition result", error);
            throw error;
        }
    }

    createRecognitionError(error: string): VoiceRecognitionError {
        const id = crypto.randomUUID();

        logger.debug("Creating recognition error object", { id, error });

        return {
            id,
            status: "error",
            error,
        };
    }
}
