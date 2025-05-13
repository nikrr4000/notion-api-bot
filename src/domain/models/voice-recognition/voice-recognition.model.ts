export type VoiceRecognitionStatuses = "created" | "pending" | "error" | "done";

export interface RecognitionConfigBase {
    language?: string;
}

export interface RecognitionAudioBase {
    uri: string;
}

export interface RecognitionResultChunk {
    text: string;
    confidence: number;
}
export interface RecognitionResultBase {
    done: boolean;
    createdAt: Date;
}

export interface VoiceRecognitionBase {
    id: string;
    status: VoiceRecognitionStatuses;
}

export interface VoiceRecognitionCreated extends VoiceRecognitionBase {
    id: string;
    status: "created";
    config: RecognitionConfigBase;
    audio: RecognitionAudioBase;
}

export interface VoiceRecognitionPending extends VoiceRecognitionBase {
    id: string;
    status: "pending";
    operationId: string;
}

export interface VoiceRecognitionError extends VoiceRecognitionBase {
    id: string;
    status: "error";
    error: string;
}

export interface VoiceRecognitionDone extends VoiceRecognitionBase {
    id: string;
    status: "done";
    result: RecognitionResultChunk[];
}

export interface OperationStatusBase {
    id: string;
}

export type VoiceRecognitionResult = VoiceRecognitionError | VoiceRecognitionPending | VoiceRecognitionDone;
