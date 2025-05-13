import { z } from "zod";

export const telegramConfigSchema = z.object({
    token: z.string().min(1, "Telegram token is required"),
    webhookUrl: z.string().optional(),
    useWebhook: z.boolean(),
    admins: z.array(z.number().int()),
});

export type TelegramConfig = z.infer<typeof telegramConfigSchema>;
