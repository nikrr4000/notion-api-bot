import { UserId } from "../user/user.model.js";

type VoiceRecordId = string
type VoiceRecordURL = string
export type StorageURL = string

export type VoiceRecordUser = {
    readonly id: UserId;
}

export type VoiceRecordMetadata = {
    readonly fileId: string;
    readonly fileUniqueId: string;
    readonly fileSize: number;
    readonly mimeType: string;
    readonly duration: number;
}

export type VoiceRecordStorage = {
    readonly provider: string;
    readonly url: StorageURL;
    readonly bucket: string;
    readonly key: string;
}

export type VoiceRecord = {
    readonly id: VoiceRecordId;
    readonly accessUrl: VoiceRecordURL;
    readonly user: VoiceRecordUser;
    readonly storage: VoiceRecordStorage;
    readonly metadata: VoiceRecordMetadata;
    readonly createdAt: Date;
}