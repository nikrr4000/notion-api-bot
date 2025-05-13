export enum ErrorSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical",
}

export enum ErrorType {
    // Ошибки, выбрасываемые бизнес-логикой
    VALIDATION = "VALIDATION",
    BUSINESS_RULE = "BUSINESS_RULE",
    NOT_FOUND = "NOT_FOUND",
    UNAUTHORIZED = "UNAUTHORIZED",

    // Технические ошибки
    CONNECTION = "CONNECTION",
    TIMEOUT = "TIMEOUT",
    EXTERNAL_API = "EXTERNAL_API",
    INFRASTRUCTURE = "INFRASTRUCTURE",

    // Ошибки взаимодействия с пользователем
    USER_INPUT = "USER_INPUT",
    USER_INTERACTION = "USER_INTERACTION",

    // Неожиданные ошибки
    UNEXPECTED = "UNEXPECTED",
}

export interface ErrorMetadata {
    [key: string]: unknown;
}

export interface AppError {
    // Базовые свойства
    type: ErrorType;
    message: string;
    code: string;

    // Контекстная информация
    severity: ErrorSeverity;
    metadata?: ErrorMetadata;
    timestamp: Date;

    // Цепочка ошибок
    cause?: Error | AppError;

    // Полезная информация для отладки
    stack?: string;

    // Сообщение для пользователя (без технических деталей)
    userMessage?: string;
}

export function createAppError(params: {
    type: ErrorType;
    message: string;
    code: string;
    severity?: ErrorSeverity;
    metadata?: ErrorMetadata;
    cause?: Error | AppError;
    userMessage?: string;
    stack?: string;
}): AppError {
    const { type, message, code, severity = ErrorSeverity.ERROR, metadata, cause, userMessage } = params;

    // Получение стека вызовов, опционально пропуская фреймы
    const stack = new Error().stack?.split("\n").slice(2).join("\n");

    return {
        type,
        message,
        code,
        severity,
        metadata,
        timestamp: new Date(),
        cause,
        stack,
        userMessage:
            userMessage || (severity !== ErrorSeverity.CRITICAL ? message : "Произошла внутренняя ошибка"),
    };
}

export function isAppError(error: unknown): error is AppError {
    return (
        typeof error === "object" &&
        error !== null &&
        "type" in error &&
        "code" in error &&
        "message" in error &&
        "timestamp" in error
    );
}

export function formatError(error: unknown, defaultType = ErrorType.UNEXPECTED): AppError {
    if (isAppError(error)) {
        return error;
    }

    if (error instanceof Error) {
        return createAppError({
            type: defaultType,
            code: `${defaultType}_ERROR`,
            message: error.message || "Произошла ошибка",
            cause: error,
            stack: error.stack,
        });
    }

    return createAppError({
        type: defaultType,
        code: `${defaultType}_ERROR`,
        message: typeof error === "string" ? error : "Произошла неизвестная ошибка",
        metadata: typeof error === "object" ? { originalError: error } : undefined,
    });
}
