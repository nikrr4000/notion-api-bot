import sanitizedConfig from "#root/config.js";
import { Bot } from "grammy";
import setUpBot from "./setUpBot.js";

const { BOT_TOKEN } = sanitizedConfig
const bot = new Bot<MyContext>(BOT_TOKEN)

const initializeBot = async () => {
    await setUpBot(bot);
    return bot;
};

export default initializeBot();