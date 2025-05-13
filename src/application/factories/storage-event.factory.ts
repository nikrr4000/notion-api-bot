import { EventType } from "#domain/events/base-event.js";
import { FileUploadedEvent } from "#domain/events/storage.events.js";

export class StorageEventFactory {
    static createFileUploadedEvent(
        filePath: string,
        publicUrl: string,
        sourceUrl: string,
    ): FileUploadedEvent {
        return {
            type: EventType.FILE_UPLOADED,
            timestamp: new Date(),
            aggregateId: filePath,
            payload: {
                uploadedFile: {
                    filePath,
                    publicUrl,
                    sourceUrl,
                },
            },
        };
    }
}
