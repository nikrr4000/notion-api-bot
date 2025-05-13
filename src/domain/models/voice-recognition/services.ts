import { VoiceRecognitionDTO } from "./voice-recognition.dto.js";
import { VoiceRecognition, VoiceRecognitionCreated } from "./voice-recognition.model.js";

const toDTO = (recognitionObj: VoiceRecognition): VoiceRecognitionDTO => {
    const { status } = recognitionObj;
    const baseObj = {
        id: recognitionObj.id,
        createdAt: recognitionObj.createdAt.toISOString(),
        updatedAt: recognitionObj.updatedAt.toISOString(),
    };

    switch (status) {
        case "created":
            return {
                ...baseObj,
                status,
                config: recognitionObj.config,
                audio: recognitionObj.audio,
            };
        case "pending":
            return {
                ...baseObj,
                status,
                operationId: recognitionObj.operationId,
            };
        case "error":
            return {
                ...baseObj,
                status,
                error: recognitionObj.error,
            };
        case "done":
            return {
                ...baseObj,
                status,
                result: recognitionObj.result,
            };
    }
};

const fromDTO = (dto: VoiceRecognitionDTO): VoiceRecognition => {
    const { status } = dto;
    const baseObj = {
        id: dto.id,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };

    switch (status) {
        case "created":
            return {
                ...baseObj,
                status,
                config: dto.config,
                audio: dto.audio,
            };
        case "pending":
            return {
                ...baseObj,
                status,
                operationId: dto.operationId,
            };
        case "error":
            return {
                ...baseObj,
                status,
                error: dto.error,
            };
        case "done":
            return {
                ...baseObj,
                status,
                result: dto.result,
            };
    }
};

const createInitialRecognition = (id: string, uri: string, language?: string): VoiceRecognitionCreated => {
    return {
        id,
        status: "created",
        config: { language },
        audio: { uri },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

export const voiceRecognition = {
    toDTO,
    fromDTO,
    createInitialRecognition,
};
