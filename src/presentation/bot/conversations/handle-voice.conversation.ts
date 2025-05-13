import { getVoiceToTextUseCase } from "#infrastructure/bootstrap/register-usecases.js";
import { logger } from "#infrastructure/logger/index.js";
import { telegramConfig } from "#root/common/config/index.js";
import { BotContext, BotConversation } from "../types.js";

export const handleVoiceConversation = () => {
    return async function handleVoice(conversation: BotConversation, ctx: BotContext) {
        try {
            await ctx.reply("Отправьте голосовое сообщение для распознавания");

            const voiceMessage = await conversation.waitFor(":voice", {
                otherwise: () => {
                    ctx.reply("Пожалуйста, отправьте голосовое сообщение");
                },
            });

            const file = await voiceMessage.getFile();
            const voiceUrl = `https://api.telegram.org/file/bot${telegramConfig.token}/${file.file_path}`;

            await ctx.reply("Ваше сообщение обрабатывается. Скоро я отправлю результат.");

            const voiceToTextUseCase = getVoiceToTextUseCase();

            const result = await voiceToTextUseCase({
                voiceUrl,
                userId: ctx.userId.toString(),
            });

            if (result.success && result.data && result.data.text) {
                await ctx.reply(`Распознанный текст:\n\n${result.data.text}`);
            } else {
                await ctx.reply(
                    `Не удалось распознать текст: ${result.error?.message || "Неизвестная ошибка"}`,
                );
            }
        } catch (error) {
            logger.error("Error in voice conversation", error);
            await ctx.reply("Произошла ошибка при обработке голосового сообщения");
        }
    };
};
