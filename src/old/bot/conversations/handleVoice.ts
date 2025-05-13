import { emitVoiceRecognizeRequest } from "#bot/controllers.js"
import { handleFileUrl, waitingResponse } from "#bot/convUtils/index.js"

export default {
    name: "handleVoice",

    handleVoice: () => {
        return async function handleVoice(conversation: MyConversation, ctx: MyContext) {
            try
            {
                await ctx.reply('send voice message')
                const downloadUrl = await handleFileUrl(conversation, ctx, "msg:voice")
                if (!downloadUrl) throw new Error('Null returned')

                //TODO: Create a mechanizm of creating references to new ctxs
                const {message_id} = await ctx.reply("your request was registered. Later you'll get the result message.")

                const { chatId, userId } = ctx
                if (!chatId) return

                let i = 0
                const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

                let done = false
                const waitingResponseFunc = waitingResponse(ctx, message_id, "Checking")
                if (!waitingResponseFunc) {
                    console.error('waitingResponseFunc error: waitingResponseFunc is null')
                    return
                }
                while (i < 150) {
                    waitingResponseFunc(done)
                    await delay()
                    i += 1
                }

                // const recognizeRes = await emitVoiceRecognizeRequest({ downloadUrl })
            } catch (error)
            {
                console.error(error);
            }

        }
    }
}