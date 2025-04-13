import { type CheckboxPropertyItemObjectResponse, type NumberPropertyItemObjectResponse, RichTextItemResponse, TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";
import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";

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
    type EventMessages = "telegram:voice" | "stt:recognize" | "stt:recognize:result" | "stt:recognize:error" | "notion:createPage" | "notion:createPage:result" | "notion:createPage:error"

    type ReceivedAudioRequestCtx = {
        userId: number;
        chatId: number;
        downloadUrl: string;
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