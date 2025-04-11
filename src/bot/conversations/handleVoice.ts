export default {
    name: "handleVoice",

    handleVoice: () => {
        return async function handleVoice(conversation: MyConversation, ctx: MyContext) {
            await ctx.reply('inside conv')
            const data = await conversation.waitFor(":text")
            await ctx.reply(data.message?.text)
        }
    }
}