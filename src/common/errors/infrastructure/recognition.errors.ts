import { createAppError, ErrorType, ErrorSeverity } from "../base-error.js";

// Коды ошибок для распознавания речи
export enum RecognitionServiceErrorCode {
    API_ERROR = "RECOGNITION_API_ERROR",
    AUTHENTICATION_FAILED = "RECOGNITION_AUTH_FAILED",
    QUOTA_EXCEEDED = "RECOGNITION_QUOTA_EXCEEDED",
    TIMEOUT = "RECOGNITION_TIMEOUT",
    INVALID_RESPONSE = "RECOGNITION_INVALID_RESPONSE",
}

/**
 * Создает ошибку сервиса распознавания
 */
export function createRecognitionServiceError(params: {
    code: RecognitionServiceErrorCode;
    message: string;
    cause?: Error;
    metadata?: Record<string, unknown>;
}) {
    return createAppError({
        type: ErrorType.EXTERNAL_API,
        code: params.code,
        message: params.message,
        severity: ErrorSeverity.ERROR,
        cause: params.cause,
        metadata: params.metadata,
        userMessage: "Ошибка при взаимодействии с сервисом распознавания речи",
    });
}

/**
 * Создает ошибку аутентификации в сервисе распознавания
 */
export function createAuthenticationError(service: string, cause?: Error, details?: string) {
    return createRecognitionServiceError({
        code: RecognitionServiceErrorCode.AUTHENTICATION_FAILED,
        message: `Ошибка аутентификации в сервисе ${service}${details ? `: ${details}` : ""}`,
        cause,
        metadata: { service, details },
    });
}

// Другие фабрики ошибок...
