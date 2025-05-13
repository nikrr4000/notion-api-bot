import { errorHandler } from "../../common/errors/error-handler.js";
import { registerServices } from "./register-services.js";
import { registerUseCases } from "./register-usecases.js";
import { registerBot, stopBot } from "./register-bot.js";
import { logger } from "../logger/index.js";

export async function bootstrap(): Promise<void> {
    try {
        errorHandler.setupGlobalErrorHandlers();

        logger.info("Starting application bootstrap...");

        // Инициализируем сервисы и сценарии
        await registerServices();
        await registerUseCases();
        await registerBot();

        logger.info("Application bootstrap completed");

        setupGracefulShutdown();
    } catch (error) {
        await errorHandler.handleError(error);
        process.exit(1);
    }
}

function setupGracefulShutdown(): void {
    const shutdown = async () => {
        logger.info("Shutting down...");
        await stopBot();

        logger.info("Graceful shutdown completed");
        process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}
