import { Context } from "grammy"
import emojis from "./loadingEmojis.js"
import { bot } from "#bot/index.js"

export const waitingResponse = (ctx: MyContext, msgId: number|undefined, opName: string) => {
    const {chatId} = ctx
    const { loadingEmojis, done } = emojis

    let emojiPointer = 0
    const shouldNullCounter = () => emojiPointer + 1 === loadingEmojis.length
    
    if (!chatId || !msgId) {
        console.error('waitingResponse error: chatId or msgId is null')
        return
    }

    const updateWaitingText = (emoji: string) => {
        const text = `${ctx.message?.text || ''}\n~\n${opName}: ${emoji}`
        bot.api.editMessageText(chatId, msgId, text)
    }

    return function (isDone: boolean) {
        if (isDone) {
            updateWaitingText(done)
            return
        }
        shouldNullCounter() ?
            emojiPointer = 0 :
            emojiPointer += 1
            
        const emoji = loadingEmojis[emojiPointer]
        updateWaitingText(emoji)
    }
}

