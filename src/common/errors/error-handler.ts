import { AppError, isAppError, formatError, ErrorType, ErrorSeverity } from "./base-error.js";
import { logger } from "#infrastructure/logger/index.js";

interface ErrorHandlerOptions {
    /**
     * Функция для отправки уведомлений о критических ошибках
     */
    notifyCriticalError?: (error: AppError) => Promise<void>;

    /**
     * Функция для сохранения ошибок в хранилище
     */
    saveError?: (error: AppError) => Promise<void>;
}

/**
 * Создает глобальный обработчик ошибок
 */
export function createErrorHandler(options: ErrorHandlerOptions = {}) {
    const { notifyCriticalError, saveError } = options;

    /**
     * Обрабатывает ошибку приложения
     */
    const handleError = async (error: unknown): Promise<AppError> => {
        // Форматируем ошибку, если это необходимо
        const appError = isAppError(error) ? error : formatError(error);

        // Логируем ошибку с соответствующим уровнем
        switch (appError.severity) {
            case ErrorSeverity.INFO:
                logger.info(appError.message, { error: appError });
                break;
            case ErrorSeverity.WARNING:
                logger.warn(appError.message, { error: appError });
                break;
            case ErrorSeverity.ERROR:
                logger.error(appError.message, appError, appError.metadata);
                break;
            case ErrorSeverity.CRITICAL:
                logger.error(`CRITICAL: ${appError.message}`, appError, appError.metadata);

                // Отправляем уведомление о критической ошибке, если настроено
                if (notifyCriticalError) {
                    try {
                        await notifyCriticalError(appError);
                    } catch (notifyError) {
                        logger.error("Failed to notify about critical error", notifyError);
                    }
                }
                break;
        }

        // Сохраняем ошибку в хранилище, если настроено
        if (saveError) {
            try {
                await saveError(appError);
            } catch (saveError) {
                logger.error("Failed to save error", saveError);
            }
        }

        return appError;
    };

    /**
     * Обрабатывает непойманные исключения и отказы промисов
     */
    const setupGlobalErrorHandlers = () => {
        // Обработка непойманных исключений
        process.on("uncaughtException", (error) => {
            const formattedError = formatError(error, ErrorType.UNEXPECTED);
            formattedError.severity = ErrorSeverity.CRITICAL;

            handleError(formattedError).finally(() => {
                // В случае непойманного исключения лучше завершить процесс
                process.exit(1);
            });
        });

        // Обработка непойманных отказов промисов
        process.on("unhandledRejection", (reason) => {
            const formattedError = formatError(reason, ErrorType.UNEXPECTED);
            formattedError.severity = ErrorSeverity.CRITICAL;

            handleError(formattedError);
            // Не завершаем процесс, так как unhandledRejection менее критичен
        });

        logger.info("Global error handlers set up");
    };

    return {
        handleError,
        setupGlobalErrorHandlers,
    };
}

// Создаем и экспортируем экземпляр обработчика ошибок
export const errorHandler = createErrorHandler();
