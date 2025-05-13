import { VoiceRecognitionStatuses } from "./voice-recognition.model.js";

export interface VoiceRecognitionBaseDTO {
    id: string;
    status: VoiceRecognitionStatuses;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVoiceRecognitionDTO extends VoiceRecognitionBaseDTO {
    status: "created";
    config: {
        language?: string;
    };
    audio: {
        uri: string;
    };
}

export interface PendingVoiceRecognitionDTO extends VoiceRecognitionBaseDTO {
    status: "pending";
    operationId: string;
}

export interface ErrorVoiceRecognitionDTO extends VoiceRecognitionBaseDTO {
    status: "error";
    error: string;
}

export interface DoneVoiceRecognitionDTO extends VoiceRecognitionBaseDTO {
    status: "done";
    result: {
        text: string;
        confidence: number;
    }[];
}

export type VoiceRecognitionDTO =
    | CreateVoiceRecognitionDTO
    | PendingVoiceRecognitionDTO
    | ErrorVoiceRecognitionDTO
    | DoneVoiceRecognitionDTO;
