import sanitizedConfig from "#root/config.js";
import { Bot } from "grammy";
import setUpBot from "./setUpBot.js";

const { BOT_TOKEN } = sanitizedConfig
const bot = new Bot<MyContext>(BOT_TOKEN)

const initializeBot = async () => {
    await setUpBot(bot)
    bot.hears('enter', async (ctx) => {
        await ctx.conversation.enter(ctx.session.conversationNames.handleVoice)
    })

    bot.start()
};

export default initializeBot;