// infrastructure/bootstrap/register-services.ts
import { initializeApplicationServices } from "./services.js";
import { rabbitmqEventBus } from "../events/rabbitmq-event-bus.js";
import { ServiceFactory } from "../factories/service.factory.js";
import { logger } from "../logger/index.js";

export async function registerServices(): Promise<void> {
    try {
        logger.info("Initializing infrastructure services...");

        const eventBus = rabbitmqEventBus;
        await (eventBus as any).initialize?.();

        ServiceFactory.getFileStorage();
        ServiceFactory.getSpeechRecognitionService();
        // ServiceFactory.getDocumentService();

        logger.info("Infrastructure services initialized successfully");

        await initializeApplicationServices();

        logger.info("All services registered successfully");
    } catch (error) {
        logger.error("Failed to initialize services", error);
        throw error;
    }
}

export { getApplicationServices } from "./services.js";
