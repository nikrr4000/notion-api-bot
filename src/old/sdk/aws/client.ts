import fsp from "node:fs/promises";
import {
    S3Client,
    PutObjectCommand,
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    paginateListObjectsV2,
    GetObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import sanitizedConfig from "#root/old/config.js";
import config from "#sdk/config.js";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = sanitizedConfig;

class AwsStorageAgent {
    private region: string;
    private endpoint_url: string;
    private aws_access_key_id: string;
    private aws_secret_access_key: string;
    private client: S3Client;
    private bucketName: string;

    constructor() {
        this.region = "ru-central1";
        this.endpoint_url = config.yc.storageEndpoint;
        this.aws_access_key_id = AWS_ACCESS_KEY_ID;
        this.aws_secret_access_key = AWS_SECRET_ACCESS_KEY;
        this.client = this.initializeClient();
        this.bucketName = config.yc.voiceBucket;
    }

    private initializeClient() {
        return new S3Client({
            region: this.region,
            endpoint: this.endpoint_url,
            credentials: {
                accessKeyId: this.aws_access_key_id,
                secretAccessKey: this.aws_secret_access_key,
            },
        });
    }
    async uploadObject({ name, stream, contentLength }: bucketUploadObj) {
        return this.client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: name,
                Body: stream,
                ContentLength: contentLength,
            }),
        );
    }
}

export default new AwsStorageAgent();
