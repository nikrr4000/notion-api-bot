import botPromise from "#bot/index.js"

console.log('restarted')

const main = async () => {
    const bot = await botPromise

    bot.hears('enter', async (ctx) => {
        await ctx.conversation.enter(ctx.session.conversationNames.handleVoice)
    })

    bot.start()
}

main()