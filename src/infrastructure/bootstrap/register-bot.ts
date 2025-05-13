import { createBotService } from "#presentation/bot/bot.service.js";
import { telegramConfig } from "#root/common/config/index.js";
import { logger } from "../logger/index.js";

let botService: ReturnType<typeof createBotService> | null = null;

export async function registerBot(): Promise<void> {
    try {
        logger.info("Registering Telegram bot...");

        botService = createBotService({
            token: telegramConfig.token,
            useWebhook: telegramConfig.useWebhook,
            webhookUrl: telegramConfig.webhookUrl,
        });

        await botService.start();

        logger.info("Telegram bot registered successfully");
    } catch (error) {
        logger.error("Failed to register Telegram bot", error);
        throw error;
    }
}

export function getBotService(): ReturnType<typeof createBotService> | null {
    return botService;
}

export async function stopBot(): Promise<void> {
    if (!botService) {
        return;
    }

    await botService.stop();
}
