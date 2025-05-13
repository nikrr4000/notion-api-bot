import { createAppError, ErrorType, ErrorSeverity } from "../base-error.js";

// Коды ошибок для сценариев использования
export enum UseCaseErrorCode {
    VALIDATION_FAILED = "VALIDATION_FAILED",
    UNAUTHORIZED_OPERATION = "UNAUTHORIZED_OPERATION",
    NOT_FOUND = "RESOURCE_NOT_FOUND",
    OPERATION_FAILED = "OPERATION_FAILED",
    INVALID_STATE = "INVALID_STATE",
}

/**
 * Создает ошибку сценария использования
 */
export function createUseCaseError(params: {
    code: UseCaseErrorCode;
    message: string;
    cause?: Error;
    metadata?: Record<string, unknown>;
    userMessage?: string;
}) {
    return createAppError({
        type: ErrorType.BUSINESS_RULE,
        code: params.code,
        message: params.message,
        severity: ErrorSeverity.ERROR,
        cause: params.cause,
        metadata: params.metadata,
        userMessage: params.userMessage,
    });
}

/**
 * Создает ошибку валидации входных данных сценария использования
 */
export function createValidationError(message: string, validationErrors?: Record<string, string[]>) {
    return createUseCaseError({
        code: UseCaseErrorCode.VALIDATION_FAILED,
        message,
        metadata: { validationErrors },
        userMessage: "Неверные входные данные",
    });
}

/**
 * Создает ошибку "ресурс не найден"
 */
export function createNotFoundError(resourceType: string, identifier: string | number) {
    return createUseCaseError({
        code: UseCaseErrorCode.NOT_FOUND,
        message: `${resourceType} с идентификатором ${identifier} не найден`,
        metadata: { resourceType, identifier },
        userMessage: `${resourceType} не найден`,
    });
}

// Другие фабрики ошибок...
