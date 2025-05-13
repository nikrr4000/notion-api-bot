import { FileStorage } from "#application/interfaces/storage.interface.js";
import { SpeechRecognitionService } from "#application/interfaces/recognition.interface.js";
// import { DocumentService } from "#application/interfaces/document.interface.js";
// import { NotionDocumentAdapter } from "../document/notion/notion-document-adapter.js";
import { AwsS3StorageAdapter } from "../storage/aws/aws-s3-storage.adapter.js";
import { YandexSTTAdapter } from "../recognition/yandex/yandex-stt.adapter.js";
import { logger } from "../logger/index.js";

let fileStorageInstance: FileStorage;
let speechRecognitionInstance: SpeechRecognitionService;
// let documentServiceInstance: DocumentService;

export class ServiceFactory {
    static getFileStorage(): FileStorage {
        if (!fileStorageInstance) {
            logger.info("Creating new FileStorage instance");
            fileStorageInstance = new AwsS3StorageAdapter();
        }
        return fileStorageInstance;
    }

    static getSpeechRecognitionService(): SpeechRecognitionService {
        if (!speechRecognitionInstance) {
            logger.info("Creating new SpeechRecognitionService instance");
            speechRecognitionInstance = new YandexSTTAdapter();
        }
        return speechRecognitionInstance;
    }

    // static getDocumentService(): DocumentService {
    //     if (!documentServiceInstance) {
    //         logger.info("Creating new DocumentService instance");
    //         documentServiceInstance = new NotionDocumentAdapter();
    //     }
    //     return documentServiceInstance;
    // }

    static clearAllInstances(): void {
        fileStorageInstance = undefined!;
        speechRecognitionInstance = undefined!;
        // documentServiceInstance = undefined!;
        logger.info("All service instances cleared");
    }
}
