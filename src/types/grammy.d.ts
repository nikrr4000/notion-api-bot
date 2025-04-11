import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor, Bot, session } from "grammy";

declare global {
    interface SessionData {
        conversationNames: ConversationNamesObj
    }
    type MyContext = Context &
        SessionFlavor<SessionData> &
        ConversationFlavor;
    type MyConversation = Conversation<MyContext>;

    type ConversationNamesT = "handleVoice"

    type ConversationContainerFunction = () => ConversationFunctionT;
    type ConversationFunctionT = (conversation: MyConversation, ctx: MyContext) => Promise<void>;
    type ConversationNamesObj = { readonly [key in ConversationNamesT]: ConversationNamesT }

    type conversationObjT = Record<ConversationNamesT, ConversationContainerFunction> & {
        name: ConversationNamesT;
    }
    type ImportedConversationObjT = {
        default: conversationObjT
    }
    type conversationNamesNConversationObjsT = {
        conversationFunctions: ConversationContainerFunction[], conversationNames: ConversationNamesObj
    }
    type MyBotT = Bot<MyContext>
}