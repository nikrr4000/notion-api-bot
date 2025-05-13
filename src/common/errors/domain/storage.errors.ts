// common/errors/domain/storage.errors.ts
import { createAppError, ErrorType, ErrorSeverity } from "../base-error.js";

// Коды ошибок для хранилища
export enum StorageErrorCode {
    UPLOAD_FAILED = "STORAGE_UPLOAD_FAILED",
    FILE_NOT_FOUND = "STORAGE_FILE_NOT_FOUND",
    INVALID_PATH = "STORAGE_INVALID_PATH",
    ACCESS_DENIED = "STORAGE_ACCESS_DENIED",
}

/**
 * Создает ошибку хранилища
 */
export function createStorageError(params: {
    code: StorageErrorCode;
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
        userMessage: params.userMessage || "Ошибка при работе с хранилищем",
    });
}

/**
 * Создает ошибку загрузки файла
 */
export function createUploadFailedError(filePath: string, cause?: Error, details?: string) {
    return createStorageError({
        code: StorageErrorCode.UPLOAD_FAILED,
        message: `Не удалось загрузить файл: ${filePath}${details ? `. ${details}` : ""}`,
        cause,
        metadata: { filePath, details },
    });
}
