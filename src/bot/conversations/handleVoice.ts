import { emitVoiceRecognizeRequest } from "#bot/controllers.js"
import { handleFileUrl } from "#bot/convUtils/index.js"
import { createEventRequestResultHandlers } from "#root/events/utils.js"

export default {
    name: "handleVoice",

    handleVoice: () => {
        return async function handleVoice(conversation: MyConversation, ctx: MyContext) {
            try
            {
                await ctx.reply('send voice message')
                const downloadUrl = await handleFileUrl(conversation, ctx, "msg:voice")
                if (!downloadUrl) throw new Error('Null returned')

                await ctx.reply("your request was registered. Later you'll get the result message.")

                const { chatId, userId } = ctx
                if (!chatId) return

                const recognizeRes = await emitVoiceRecognizeRequest({ downloadUrl })
            } catch (error)
            {
                console.error(error);
            }

        }
    }
}