import { logger } from "#infrastructure/logger/index.js";
import { BotContext } from "../types.js";

export async function handleStartCommand(ctx: BotContext): Promise<void> {
    try {
        const userName = ctx.from?.first_name || "пользователь";

        await ctx.reply(
            `Привет, ${userName}! Я бот для распознавания голосовых сообщений. ` +
                `Отправьте мне голосовое сообщение, и я преобразую его в текст.`,
        );

        logger.info("Start command handled", {
            userId: ctx.from?.id,
            chatId: ctx.chat?.id,
        });
    } catch (error) {
        logger.error("Error handling start command", error);
        await ctx.reply("Произошла ошибка при обработке команды.");
    }
}
