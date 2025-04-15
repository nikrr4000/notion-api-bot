import { type CheckboxPropertyItemObjectResponse, type NumberPropertyItemObjectResponse, RichTextItemResponse, TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";
import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";
import type EventEmitter from "node:events";
import type EventController from "#root/events/EventEmitterFactory.ts";

declare global {
    type RichTextPropertyItemObject = {
        type: "rich_text",
        rich_text: {
            type: "text",
            text: {
                content: string,
                link: { url: string } | null
            },
            annotations: {
                bold: boolean,
                italic: boolean,
                strikethrough: boolean,
                underline: boolean,
                code: boolean,
                color: string
            },
            plain_text: string,
            href: null
        }[]
    }
    type TitlePropertyItemObject = {
        type: "title",
        title: {
            type: "text",
            text: {
                content: string,
                link: { url: string } | null
            }
        }[]
    }

    type RichTextPropertyItemRequest = RichTextPropertyItemObject;
    type TitlePropertyItemRequest = TitlePropertyItemObject;
    type NumberPropertyItemRequest = Omit<NumberPropertyItemObjectResponse, "id" | "object">;
    type CheckboxPropertyItemRequest = Omit<CheckboxPropertyItemObjectResponse, "id" | "object">;

    type PropertyItemRequest = RichTextPropertyItemRequest | NumberPropertyItemRequest | CheckboxPropertyItemRequest | TitlePropertyItemRequest
    type PropertyObj = CreatePageParameters['properties'];

    type NotionInputRichText = { type: 'rich_text', data: string };
    type NotionInputNumber = { type: 'number', data: number };
    type NotionInputCheckbox = { type: 'checkbox', data: boolean };
    type NotionInputTitle = { type: 'title', data: string };

    type NotionInput = NotionInputRichText | NotionInputNumber | NotionInputCheckbox | NotionInputTitle;
}
declare global {
    namespace events {
        type EmitterOn = <T>(eventName: EventMessages, listener: (message: T) => void) => void
        type EmitterEmit = <T>(eventName: EventMessages, message: T) => void
        type EmitterOff = <T>(eventName: EventMessages, listener: (...args: unknown[]) => void) => void

        type eventMethodsObj = {
            emitterEmit: EmitterEmit,
            emitterOn: EmitterOn,
            emitterOff: EmitterOff
        }

        type EventMessages = TelegramEventMessage | SttEventMessage

        type SttEventMessage = "stt:recognize" | "stt:recognize:result" | "stt:recognize:error"

        type TelegramInitializeActionMessage = "telegram:recognize-voice"
        type TelegramActionResultMessage = "telegram:recognize-voice:result" | "telegram:recognize-voice:error"
        type TelegramEventMessage = TelegramActionResultMessage | TelegramInitializeActionMessage

        type EmitterEnhancedObj<T> = T & { event: EventController }
    }

    type TelegramWaiterData = {
        result: EventCallbackKeys;
        resultListeners: {
            success: TelegramActionResultMessage,
            error: TelegramActionResultMessage
        }
    }
    type WaitersType = TelegramWaiterData

    type ReceivedAudioRequestCtx = {
        resultWaiterData: WaitersType;
        downloadUrl: string;
        event: EventController;
    }
    type EventCallbackKeys<T> = {
        success: T;
        done: boolean;
        // info?: string;
        error: string
    }
}
declare global {
    namespace stt {
        type recognizeRequestObj = {
            bucketUrl: string
            eventController: EventController;
        }
    }
}
declare global {
    type bucketUploadObj = {
        name: string;
        stream: Readable;
        contentLength: number
    }
}

declare global {
    type ResultObj<T = null, U = undefined, K = string | null> = {
        result: T,
        info?: U,
        error: K,
    }
}

declare global {
    type SessionData = {
        conversationNames: ConversationNamesObj
    }
    type extendedFields = { userId: number }
    type MyContext = SessionFlavor<SessionData> &
        ConversationFlavor<Context> & extendedFields;
    type MyConversation = Conversation<MyContext>;

    type ConversationNamesT = "handleVoice"

    type ConversationContainerFunction = () => ConversationFunctionT;
    type ConversationFunctionT = ConversationBuilder<MyContext, MyContext>;
    type ConversationNamesObj = { readonly [key in ConversationNamesT]: ConversationNamesT }

    type ConversationObjT = Record<ConversationNamesT, ConversationContainerFunction> & {
        name: ConversationNamesT;
    }
    type ImportedConversationObjT = {
        default: ConversationObjT
    }
    type conversationNamesNConversationObjsT = {
        conversationFunctions: ConversationContainerFunction[], conversationNames: ConversationNamesObj
    }
    type MyBotT = Bot<MyContext>
}