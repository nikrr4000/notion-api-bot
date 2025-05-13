import { createAppError, ErrorType, ErrorSeverity } from "../base-error.js";

// Коды ошибок для бота
export enum BotErrorCode {
    COMMAND_FAILED = "BOT_COMMAND_FAILED",
    MESSAGE_FAILED = "BOT_MESSAGE_FAILED",
    CONVERSATION_ERROR = "BOT_CONVERSATION_ERROR",
    API_ERROR = "BOT_API_ERROR",
}

/**
 * Создает ошибку бота
 */
export function createBotError(params: {
    code: BotErrorCode;
    message: string;
    cause?: Error;
    metadata?: Record<string, unknown>;
    userMessage?: string;
}) {
    return createAppError({
        type: ErrorType.USER_INTERACTION,
        code: params.code,
        message: params.message,
        severity: ErrorSeverity.WARNING,
        cause: params.cause,
        metadata: params.metadata,
        userMessage: params.userMessage || "Ошибка при обработке сообщения",
    });
}

/**
 * Создает ошибку выполнения команды бота
 */
export function createCommandFailedError(command: string, cause?: Error, userId?: number, chatId?: number) {
    return createBotError({
        code: BotErrorCode.COMMAND_FAILED,
        message: `Ошибка при выполнении команды ${command}`,
        cause,
        metadata: { command, userId, chatId },
    });
}
