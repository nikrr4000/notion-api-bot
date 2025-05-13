import config from "#bot/config.js"
import { FilterQuery } from "grammy"

export const handleFileUrl = async (conversation: MyConversation, ctx: MyContext, filterQuery: FilterQuery) => {
    const msgObjWithFile = await conversation.waitFor(filterQuery, {
        otherwise: () => {
            ctx.reply('Wrong fileType. Ty again')
            conversation.halt()
        }
    })

    if (!("getFile" in msgObjWithFile)) return null
    const { file_path } = await msgObjWithFile.getFile()
    const token = ctx.api.token

    return `${config.telegramBotApiUri}${token}/${file_path}`
}