import { EventBus } from "../interfaces/events/event-bus.interface.js";
import { FileStorage, StorageResult } from "../interfaces/storage.interface.js";
import { ServiceFactory } from "./types.js";
import { StorageEventFactory } from "#application/factories/storage-event.factory.js";

export interface StorageServiceDependencies {
    fileStorage: FileStorage;
    eventBus: EventBus;
}

export interface StorageService {
    uploadFromUrl(sourceUrl: string, destinationPath?: string): Promise<StorageResult>;

    uploadFile(buffer: Buffer, fileName: string, contentType?: string): Promise<StorageResult>;

    generatePublicUrl(filePath: string, expirationMinutes?: number): Promise<string>;

    deleteFile(filePath: string): Promise<boolean>;
}

export const createStorageService: ServiceFactory<StorageService, StorageServiceDependencies> = ({
    fileStorage,
    eventBus,
}) => {
    return {
        async uploadFromUrl(sourceUrl, destinationPath) {
            const result = await fileStorage.uploadFileFromUrl(sourceUrl, destinationPath);

            if (result.success) {
                await eventBus.publish(
                    StorageEventFactory.createFileUploadedEvent(result.filePath, result.publicUrl, sourceUrl),
                );
            }

            return result;
        },

        async uploadFile(buffer, fileName, contentType) {
            const result = await fileStorage.uploadFile(buffer, fileName, contentType);

            if (result.success) {
                await eventBus.publish(
                    StorageEventFactory.createFileUploadedEvent(result.filePath, result.publicUrl, "buffer"),
                );
            }

            return result;
        },

        async generatePublicUrl(filePath, expirationMinutes) {
            const expirationSeconds = expirationMinutes ? expirationMinutes * 60 : undefined;
            return fileStorage.getPublicUrl(filePath, expirationSeconds);
        },

        async deleteFile(filePath) {
            const result = await fileStorage.deleteFile(filePath);

            return result;
        },
    };
};
