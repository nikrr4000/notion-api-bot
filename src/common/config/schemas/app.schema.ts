import { z } from "zod";

export const appConfigSchema = z.object({
    port: z.number().int().positive(),
    host: z.string(),
    apiPrefix: z.string(),
    logLevel: z.enum(["error", "warn", "info", "debug"]),
    isProduction: z.boolean(),
    isDevelopment: z.boolean(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
