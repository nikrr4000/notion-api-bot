import { createVoiceToTextUseCase, VoiceToTextUseCase } from "#application/usecases/index.js";
import { getApplicationServices } from "./register-services.js";
import { rabbitmqEventBus } from "../events/rabbitmq-event-bus.js";
import { logger } from "../logger/index.js";

let voiceToTextUseCase: VoiceToTextUseCase;

export async function registerUseCases(): Promise<void> {
    try {
        logger.info("Registering use cases...");

        const services = getApplicationServices();

        voiceToTextUseCase = createVoiceToTextUseCase({
            recognitionService: services.recognition,
            storageService: services.storage,
            eventBus: rabbitmqEventBus,
        });

        logger.info("Use cases registered successfully");
    } catch (error) {
        logger.error("Failed to register use cases", error);
        throw error;
    }
}

export function getVoiceToTextUseCase(): VoiceToTextUseCase {
    if (!voiceToTextUseCase) {
        throw new Error("VoiceToTextUseCase is not initialized");
    }

    return voiceToTextUseCase;
}
