import { Bot, session, GrammyError } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { BotContext, BotConfig, SessionData } from "./types.js";
import { handleStartCommand } from "./commands/index.js";
import { handleVoiceMessage } from "./handlers/index.js";
import { extendContextMiddleware } from "./middlewares/index.js";
import { handleVoiceConversation } from "./conversations/index.js";
import { logger } from "#infrastructure/logger/index.js";

export function createBot(config: BotConfig): Bot<BotContext> {
    try {
        logger.info("Creating Telegram bot...");

        const bot = new Bot<BotContext>(config.token);

        bot.catch((err) => {
            const ctx = err.ctx;
            logger.error(`Error while handling update ${ctx.update.update_id}:`, err.error);

            if (err.error instanceof GrammyError) {
                logger.error("Error in request to Telegram API:", err.error);
            }
        });

        bot.use(extendContextMiddleware());

        // Настраиваем сессии
        bot.use(
            session({
                initial: (): SessionData => ({
                    conversationNames: {
                        handleVoice: "handleVoice",
                    },
                }),
            }),
        );

        bot.use(conversations());
        bot.use(createConversation(handleVoiceConversation));

        bot.command("start", handleStartCommand);
        bot.command("voice", async (ctx) => {
            await ctx.conversation.enter("handleVoice");
        });

        bot.on(":voice", handleVoiceMessage);

        logger.info("Telegram bot created successfully");

        return bot;
    } catch (error) {
        logger.error("Failed to create Telegram bot", error);
        throw error;
    }
}
