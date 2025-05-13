import {
    RecognitionAudioBase,
    RecognitionConfigBase,
    VoiceRecognitionCreated,
    VoiceRecognitionDone,
    VoiceRecognitionError,
    VoiceRecognitionPending,
    VoiceRecognitionResult,
} from "#root/domain/models/index.js";

export interface SpeechRecognitionService {
    createRecognitionRequest<T extends RecognitionConfigBase, U extends RecognitionAudioBase>(
        id: string,
        config: T,
        audio: U,
    ): Promise<VoiceRecognitionCreated>;
    registerRecognitionRequest(recognitionObj: VoiceRecognitionCreated): Promise<VoiceRecognitionPending>;
    getOperationStatus(requestId: string, opId: string): Promise<VoiceRecognitionResult>;
    processRecognitionResult(recognitionResult: VoiceRecognitionDone): Promise<VoiceRecognitionDone>;
    recognizeSpeech(
        audio: RecognitionAudioBase,
        config?: RecognitionConfigBase,
    ): Promise<VoiceRecognitionDone | VoiceRecognitionError>;
    createRecognitionError(error: string): VoiceRecognitionError;
}
