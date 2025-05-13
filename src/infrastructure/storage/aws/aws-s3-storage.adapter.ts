import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as crypto from "crypto";
import axios from "axios";
import { FileStorage, StorageResult, FileInfo } from "#application/interfaces/storage.interface.js";
import { logger } from "../../logger/index.js";
import { storageConfig } from "#root/common/config/index.js";

export class AwsS3StorageAdapter implements FileStorage {
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly urlExpirationSeconds: number;

    constructor() {
        const { region, accessKeyId, secretAccessKey, s3 } = storageConfig.aws;

        const clientConfig: any = {
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        };

        if (s3.endpoint) {
            clientConfig.endpoint = s3.endpoint;
            clientConfig.forcePathStyle = true;
        }

        this.s3Client = new S3Client(clientConfig);
        this.bucket = s3.bucket;
        this.urlExpirationSeconds = s3.publicUrlExpiration;

        logger.info("AWS S3 Storage adapter initialized", { bucket: this.bucket });
    }

    async uploadFileFromUrl(fileUrl: string, destinationPath?: string): Promise<StorageResult> {
        try {
            logger.debug("Downloading file from URL", { fileUrl });
            const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

            const path = destinationPath || this.generateRandomPath();

            logger.debug("Uploading file to S3", { path, bucket: this.bucket });

            logger.debug("Upload object", {
                Bucket: this.bucket,
                Key: path,
                Body: response.data,
                ContentType: response.headers["content-type"],
                ContentLength: response.headers["content-length"],
            });
            const uploadCommand = new PutObjectCommand({
                Bucket: this.bucket,
                Key: path,
                Body: response.data,
                ContentType: response.headers["content-type"],
                ContentLength: response.headers["content-length"],
            });

            await this.s3Client.send(uploadCommand);

            const publicUrl = await this.getPublicUrl(path);

            logger.info("File uploaded successfully", { path, publicUrl });

            return {
                success: true,
                filePath: path,
                publicUrl,
            };
        } catch (error) {
            logger.error("Failed to upload file from URL", error, { fileUrl });

            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async uploadFile(fileBuffer: Buffer, fileName: string, contentType?: string): Promise<StorageResult> {
        try {
            const path = `uploads/${fileName}`;

            logger.debug("Uploading buffer to S3", { path, bucket: this.bucket });

            const uploadCommand = new PutObjectCommand({
                Bucket: this.bucket,
                Key: path,
                Body: fileBuffer,
                ContentType: contentType || "application/octet-stream",
                ContentLength: fileBuffer.length,
            });

            await this.s3Client.send(uploadCommand);

            // Получаем публичный URL для дальнейшего доступа
            const publicUrl = await this.getPublicUrl(path);

            logger.info("File buffer uploaded successfully", { path, publicUrl });

            return {
                success: true,
                filePath: path,
                publicUrl,
            };
        } catch (error) {
            logger.error("Failed to upload file buffer", error, { fileName });

            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async getFileInfo(filePath: string): Promise<FileInfo> {
        try {
            logger.debug("Getting file info from S3", { filePath, bucket: this.bucket });

            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: filePath,
            });

            const response = await this.s3Client.send(command);

            return {
                name: filePath.split("/").pop() || filePath,
                size: response.ContentLength || 0,
                mimeType: response.ContentType || "application/octet-stream",
                lastModified: response.LastModified || new Date(),
            };
        } catch (error) {
            logger.error("Failed to get file info", error, { filePath });
            throw error;
        }
    }

    // async getFileContent(filePath: string): Promise<Buffer> {
    //     try {
    //         logger.debug("Getting file content from S3", { filePath, bucket: this.bucket });

    //         const command = new GetObjectCommand({
    //             Bucket: this.bucket,
    //             Key: filePath,
    //         });

    //         const response = await this.s3Client.send(command);

    //         if (response.Body instanceof Readable) {
    //             return new Promise<Buffer>((resolve, reject) => {
    //                 const chunks: Buffer[] = [];
    //                 const stream = response.Body as Readable;

    //                 stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    //                 stream.on("error", reject);
    //                 stream.on("end", () => resolve(Buffer.concat(chunks)));
    //             });
    //         } else {
    //             throw new Error("Response body is not a readable stream");
    //         }
    //     } catch (error) {
    //         logger.error("Failed to get file content", error, { filePath });
    //         throw error;
    //     }
    // }

    async getPublicUrl(filePath: string, expirationSeconds?: number): Promise<string> {
        try {
            const expiration = expirationSeconds || this.urlExpirationSeconds;

            logger.debug("Generating pre-signed URL", {
                filePath,
                bucket: this.bucket,
                expiration,
            });

            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: filePath,
            });

            const url = await getSignedUrl(this.s3Client, command, {
                expiresIn: expiration,
            });

            return url;
        } catch (error) {
            logger.error("Failed to generate public URL", error, { filePath });
            throw error;
        }
    }

    async deleteFile(filePath: string): Promise<boolean> {
        try {
            logger.debug("Deleting file from S3", { filePath, bucket: this.bucket });

            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: filePath,
            });

            await this.s3Client.send(command);

            logger.info("File deleted successfully", { filePath });

            return true;
        } catch (error) {
            logger.error("Failed to delete file", error, { filePath });
            return false;
        }
    }

    private generateRandomPath(): string {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString("hex");
        return `uploads/${timestamp}-${randomString}`;
    }
}
