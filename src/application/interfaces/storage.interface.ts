export interface FileStorage {
    uploadFileFromUrl(url: string, destinationPath?: string): Promise<StorageResult>;
    getFileInfo(url: string): Promise<FileInfo>;
    getPublicUrl(url: string, expirationSeconds?: number): Promise<string>;
    uploadFile(fileBuffer: Buffer, fileName: string, contentType?: string): Promise<StorageResult>;
    deleteFile(url: string): Promise<boolean>;
}

interface StorageResultSuccess {
    success: true;
    filePath: string;
    publicUrl: string;
}
interface StorageResultError {
    success: false;
    error?: string;
}
export type StorageResult = StorageResultSuccess | StorageResultError;
export interface FileInfo {
    name: string;
    size: number;
    mimeType: string;
    lastModified: Date;
}
