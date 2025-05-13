import { VoiceRecordDTO } from "./voice-record.dto.js";
import { VoiceRecord } from "./voice-record.model.js";

const toDTO = (voiceRecord: VoiceRecord): VoiceRecordDTO => {
    return {
        id: voiceRecord.id,
        accessUrl: voiceRecord.accessUrl,
        user: {
            id: voiceRecord.user.id,
        },
        storage: {
            provider: voiceRecord.storage.provider,
            url: voiceRecord.storage.url,
            bucket: voiceRecord.storage.bucket,
            key: voiceRecord.storage.key,
        },
        metadata: {
            fileId: voiceRecord.metadata.fileId,
            fileUniqueId: voiceRecord.metadata.fileUniqueId,
            fileSize: voiceRecord.metadata.fileSize,
            mimeType: voiceRecord.metadata.mimeType,
            duration: voiceRecord.metadata.duration,
        },
        createdAt: voiceRecord.createdAt.toISOString(),
    };
};

const fromDTO = (dto: VoiceRecordDTO): VoiceRecord => {
    return {
        id: dto.id,
        accessUrl: dto.accessUrl,
        user: {
            id: dto.user.id,
        },
        storage: {
            provider: dto.storage.provider,
            url: dto.storage.url,
            bucket: dto.storage.bucket,
            key: dto.storage.key,
        },
        metadata: {
            fileId: dto.metadata.fileId,
            fileUniqueId: dto.metadata.fileUniqueId,
            fileSize: dto.metadata.fileSize,
            mimeType: dto.metadata.mimeType,
            duration: dto.metadata.duration,
        },
        createdAt: new Date(dto.createdAt),
    };
};

export const voiceRecord = { toDTO, fromDTO };
