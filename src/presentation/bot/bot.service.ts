// presentation/bot/bot.service.ts
import { Bot } from "grammy";
import { BotContext, BotConfig } from "./types.js";
import { createBot } from "./bot.factory.js";
import { logger } from "#infrastructure/logger/index.js";

export const createBotService = (config: BotConfig) => {
    let bot: Bot<BotContext> | null = null;

    return {
        async start(): Promise<void> {
            if (bot) {
                logger.warn("Bot is already running");
                return;
            }

            try {
                bot = createBot(config);

                if (config.useWebhook && config.webhookUrl) {
                    logger.info("Starting bot in webhook mode");
                    await bot.api.setWebhook(config.webhookUrl);
                } else {
                    logger.info("Starting bot in long polling mode");
                    await bot.start();
                }

                logger.info("Bot started successfully");
            } catch (error) {
                logger.error("Failed to start bot", error);
                throw error;
            }
        },

        async stop(): Promise<void> {
            if (!bot) {
                logger.warn("Bot is not running");
                return;
            }

            try {
                logger.info("Stopping bot...");
                await bot.stop();
                bot = null;
                logger.info("Bot stopped successfully");
            } catch (error) {
                logger.error("Failed to stop bot", error);
                throw error;
            }
        },

        getBot(): Bot<BotContext> | null {
            return bot;
        },
    };
};
