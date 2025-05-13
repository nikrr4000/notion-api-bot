import { Context, SessionFlavor } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

export interface SessionData {
    conversationNames: Record<string, string>;
}

export interface ContextExtension {
    userId: number;
}

export type BotContext = Context &
    SessionFlavor<SessionData> &
    ConversationFlavor<Context> &
    ContextExtension;

export type BotConversation = Conversation<BotContext>;

export interface BotConfig {
    token: string;
    webhookUrl?: string;
    useWebhook: boolean;
}
