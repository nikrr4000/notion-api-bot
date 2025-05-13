import {
    createRecognitionService,
    RecognitionService,
} from "../../application/services/recognition.service.js";
import { createStorageService, StorageService } from "../../application/services/storage.service.js";
// import {
//   createDocumentService,
//   AppDocumentService
// } from '../../application/services/document.service';
import { ServiceFactory } from "../factories/service.factory.js";
import { rabbitmqEventBus } from "../events/rabbitmq-event-bus.js";
import { logger } from "../logger/index.js";

export interface ApplicationServices {
    recognition: RecognitionService;
    storage: StorageService;
    // document: AppDocumentService;
}

let applicationServices: ApplicationServices | null = null;

export async function initializeApplicationServices(): Promise<ApplicationServices> {
    if (applicationServices) {
        return applicationServices;
    }

    try {
        logger.info("Initializing application services layer...");

        const speechRecognition = ServiceFactory.getSpeechRecognitionService();
        const fileStorage = ServiceFactory.getFileStorage();
        // const documentService = ServiceFactory.getDocumentService();

        const recognition = createRecognitionService({
            speechRecognition,
            eventBus: rabbitmqEventBus,
        });

        const storage = createStorageService({
            fileStorage,
            eventBus: rabbitmqEventBus,
        });

        // const document = createDocumentService({
        //   documentService,
        //   eventBus: rabbitmqEventBus
        // });

        applicationServices = {
            recognition,
            storage,
            // document
        };

        logger.info("Application services layer initialized successfully");

        return applicationServices;
    } catch (error) {
        logger.error("Failed to initialize application services", error);
        throw error;
    }
}

export function getApplicationServices(): ApplicationServices {
    if (!applicationServices) {
        throw new Error(
            "Application services are not initialized. Call initializeApplicationServices() first.",
        );
    }

    return applicationServices;
}

export function clearApplicationServices(): void {
    applicationServices = null;
    logger.debug("Application services cleared");
}
