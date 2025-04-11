import fs from "node:fs"
import path from "node:path";
import { conversations, createConversation } from "@grammyjs/conversations";
import { session } from "grammy";
import initialSessionObj from "./initialSessionObj.js";

const importedConversationObjs = async () => {
    const conversationsPath = path.join(import.meta.dirname, 'conversations');
    const conversationFiles = fs.readdirSync(conversationsPath);

    const importPromises = conversationFiles.map<Promise<ImportedConversationObjT>>(fileName => {
        const filePath = path.join(conversationsPath, fileName);
        return import(filePath)
    })
    const imports = await Promise.all(importPromises)

    return imports.reduce((acc, importData) => {
        try
        {
            const { name } = importData.default
            const conversation = importData.default[name]

            acc.conversationNames = { ...acc.conversationNames, [name]: name }
            acc.conversationFunctions.push(conversation)
        } catch (error)
        {
            console.error("Ошибка при импорте conversation:\n", error);
        }
        return acc
    }, { conversationFunctions: [] as ConversationContainerFunction[], conversationNames: {} as ConversationNamesObj } as conversationNamesNConversationObjsT)
}

const setUpMiddlewares = (bot: MyBotT) => {
    bot.api.config.use((prev, method, payload) => {
        if ("parse_mode" in payload)
        {
            payload.parse_mode = "HTML"
        }
        return prev(method, payload)
    })

    bot.use(conversations());
}
const initializeSession = (bot: MyBotT, conversationNames: ConversationNamesObj) => {
    const sessionObj = structuredClone(initialSessionObj) as SessionData
    sessionObj.conversationNames = conversationNames
    bot.use(
        session({
            initial: () => sessionObj,
        }),
    );
}
const initializeConversations = async (bot: MyBotT, conversations: ConversationContainerFunction[]) => {
    for (const conv of conversations)
    {
        const convFunc = conv()
        bot.use(createConversation(convFunc))
    }
}


export default async (bot: MyBotT) => {
    const conversationsData = await importedConversationObjs()
    const { conversationNames, conversationFunctions } = conversationsData

    console.log(conversationFunctions);


    initializeSession(bot, conversationNames)
    setUpMiddlewares(bot)
    initializeConversations(bot, conversationFunctions)
}
