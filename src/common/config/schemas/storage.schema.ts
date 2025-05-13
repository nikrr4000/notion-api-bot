import { z } from "zod";

export const storageConfigSchema = z.object({
    aws: z.object({
        region: z.string(),
        accessKeyId: z.string().min(1, "AWS access key ID is required"),
        secretAccessKey: z.string().min(1, "AWS secret access key is required"),
        s3: z.object({
            bucket: z.string().min(1, "S3 bucket name is required"),
            endpoint: z.string().optional(),
            publicUrlExpiration: z.number().int().positive(),
        }),
    }),
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;
