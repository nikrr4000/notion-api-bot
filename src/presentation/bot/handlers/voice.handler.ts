import { getVoiceToTextUseCase } from "#infrastructure/bootstrap/register-usecases.js";
import { logger } from "#infrastructure/logger/index.js";
import { telegramConfig } from "#root/common/config/index.js";
import { BotContext } from "../types.js";

export async function handleVoiceMessage(ctx: BotContext): Promise<void> {
    try {
        if (!ctx.message?.voice) {
            await ctx.reply("Не удалось получить голосовое сообщение.");
            return;
        }

        const userId = ctx.from?.id;

        if (!userId) {
            await ctx.reply("Не удалось определить пользователя.");
            return;
        }

        const file = await ctx.getFile();
        const voiceUrl = `https://api.telegram.org/file/bot${telegramConfig.token}/${file.file_path}`;

        const processingMessage = await ctx.reply("🔍 Распознаю ваше голосовое сообщение...");

        const voiceToTextUseCase = getVoiceToTextUseCase();

        const result = await voiceToTextUseCase({
            voiceUrl,
            userId: userId.toString(),
            language: "ru-RU",
        });

        if (result.success && result.data) {
            if (result.data.status === "completed" && result.data.text) {
                await ctx.api.editMessageText(
                    ctx.chatId || "",
                    processingMessage.message_id,
                    `✅ Распознанный текст:\n\n${result.data.text}`,
                );
            } else {
                await ctx.api.editMessageText(
                    ctx.chatId || "",
                    processingMessage.message_id,
                    `❌ Не удалось распознать текст: ${result.data.status}`,
                );
            }
        } else {
            await ctx.api.editMessageText(
                ctx.chatId || "",
                processingMessage.message_id,

                `❌ Ошибка при обработке: ${result.error?.message || "Неизвестная ошибка"}`,
            );
        }

        logger.info("Voice message handled", {
            userId,
            success: result.success,
        });
    } catch (error) {
        logger.error("Error handling voice message", error);
        await ctx.reply("Произошла ошибка при обработке голосового сообщения.");
    }
}
