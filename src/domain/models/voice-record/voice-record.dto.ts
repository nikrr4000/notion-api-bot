export type VoiceRecordDTO = {
    id: string;
    accessUrl: string;
    user: {
        id: string;
    };
    storage: {
        provider: string;
        url: string;
        bucket: string;
        key: string;
    };
    metadata: {
        fileId: string;
        fileUniqueId: string;
        fileSize: number;
        mimeType: string;
        duration: number;
    };
    createdAt: string;
}