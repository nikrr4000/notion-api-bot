import { z } from "zod";

export const YCConfigSchema = z.object({
    apiKey: z.string().min(1, "Yandex API key is required"),
    folderId: z.string().min(1, "Yandex folder ID is required"),
    operationPollingDelay: z.number().int().positive(),
});

export type YCConfig = z.infer<typeof YCConfigSchema>;
