// common/errors/domain/voice-recognition.errors.ts
import { createAppError, ErrorType, ErrorSeverity } from "../base-error.js";

// Коды ошибок для распознавания голоса
export enum VoiceRecognitionErrorCode {
    RECOGNITION_FAILED = "VOICE_RECOGNITION_FAILED",
    INVALID_AUDIO_FORMAT = "INVALID_AUDIO_FORMAT",
    TOO_SHORT_AUDIO = "TOO_SHORT_AUDIO",
    EMPTY_RECOGNITION_RESULT = "EMPTY_RECOGNITION_RESULT",
    OPERATION_TIMEOUT = "VOICE_RECOGNITION_TIMEOUT",
}

/**
 * Создает ошибку распознавания голоса
 */
export function createVoiceRecognitionError(params: {
    code: VoiceRecognitionErrorCode;
    message: string;
    cause?: Error;
    metadata?: Record<string, unknown>;
    userMessage?: string;
}) {
    return createAppError({
        type: ErrorType.BUSINESS_RULE,
        code: params.code,
        message: params.message,
        severity: ErrorSeverity.WARNING,
        cause: params.cause,
        metadata: params.metadata,
        userMessage: params.userMessage || "Не удалось распознать голосовое сообщение",
    });
}

/**
 * Создает ошибку неудачного распознавания
 */
export function createRecognitionFailedError(
    message = "Не удалось распознать голосовое сообщение",
    cause?: Error,
    metadata?: Record<string, unknown>,
) {
    return createVoiceRecognitionError({
        code: VoiceRecognitionErrorCode.RECOGNITION_FAILED,
        message,
        cause,
        metadata,
    });
}

/**
 * Создает ошибку неверного формата аудио
 */
export function createInvalidAudioFormatError(format: string, cause?: Error) {
    return createVoiceRecognitionError({
        code: VoiceRecognitionErrorCode.INVALID_AUDIO_FORMAT,
        message: `Неподдерживаемый формат аудио: ${format}`,
        cause,
        metadata: { format },
    });
}
