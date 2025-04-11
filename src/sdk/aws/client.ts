import fsp from "node:fs/promises"
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
import sanitizedConfig from "#root/config.js";
import path from "node:path";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = sanitizedConfig

class AwsStorageAgent {
    private region: string;
    private endpoint_url: string;
    private aws_access_key_id: string;
    private aws_secret_access_key: string;
    private client: S3Client;
    private bucketName: string

    constructor() {
        this.region = "ru-central1"
        this.endpoint_url = "https://storage.yandexcloud.net"
        this.aws_access_key_id = AWS_ACCESS_KEY_ID
        this.aws_secret_access_key = AWS_SECRET_ACCESS_KEY
        this.client = this.initializeClient()
        this.bucketName = "voice-container"
    }

    private initializeClient() {
        return new S3Client({
            region: this.region,
            endpoint: this.endpoint_url,
            credentials: {
                accessKeyId: this.aws_access_key_id,
                secretAccessKey: this.aws_secret_access_key
            }
        })
    }
    async uploadObject(pat: string, key: string) {
        const body = await fsp.readFile(pat)
        return this.client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: body,
            }),
        )
    }
}

export default new AwsStorageAgent()

// (async function () {
//     const s3Client = new S3Client({});

//     const bucketName = `test-bucket-${Date.now()}`;

//     console.log(`Creating the bucket ${bucketName}.`);
//     await s3Client.send(
//         new CreateBucketCommand({
//             Bucket: bucketName,
//         }),
//     );
//     console.log(`The bucket ${bucketName} was created.\n\n`);

//     console.log('Creating a object from string.');
//     await s3Client.send(
//         new PutObjectCommand({
//             Bucket: bucketName,
//             Key: "bucket-text",
//             Body: 'Hello bucket!',
//         }),
//     );
//     console.log('The object from string was created.\n');
//     console.log('Creating the first object from local file.');
//     await s3Client.send(
//         new PutObjectCommand({
//             Bucket: bucketName,
//             Key: "my-package.json",
//             Body: readFileSync('package.json'),
//         }),
//     );
//     console.log('The first object was created.\nCreating the second object from local file.');
//     await s3Client.send(
//         new PutObjectCommand({
//             Bucket: bucketName,
//             Key: "my-package-lock.json",
//             Body: readFileSync('package-lock.json'),
//         }),
//     );
//     console.log('The second object was created.\n');

//     console.log('Getting bucket objects list.');
//     const command = new ListObjectsV2Command({ Bucket: bucketName });
//     const { Contents } = await s3Client.send(command);
//     const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
//     console.log("Here's a list of files in the bucket:");
//     console.log(`${contentsList}\n`);

//     console.log('Deleting objects.');
//     await s3Client.send(
//         new DeleteObjectCommand({ Bucket: bucketName, Key: "my-package.json" }),
//     );
//     await s3Client.send(
//         new DeleteObjectCommand({ Bucket: bucketName, Key: "my-package-lock.json" }),
//     );
//     console.log('The objects were deleted.\n');

//     console.log('Getting your "bucket-text" object')
//     const { Body } = await s3Client.send(
//         new GetObjectCommand({
//             Bucket: bucketName,
//             Key: "bucket-text",
//         }),
//     );
//     console.log('Your "bucket-text" content:')
//     console.log(await Body.transformToString(), '\n');

//     const paginator = paginateListObjectsV2(
//         { client: s3Client },
//         { Bucket: bucketName },
//     );
//     for await (const page of paginator)
//     {
//         const objects = page.Contents;
//         if (objects)
//         {
//             for (const object of objects)
//             {
//                 await s3Client.send(
//                     new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key }),
//                 );
//             }
//         }
//     }

//     await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
//     console.log('Your bucket was emptied and deleted.');
// })()
