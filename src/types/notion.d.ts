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

    type notionInputRichText = { type: 'rich_text', data: string };
    type notionInputNumber = { type: 'number', data: number };
    type notionInputCheckbox = { type: 'checkbox', data: boolean };
    type notionInputTitle = { type: 'title', data: string };

    type notionInput = notionInputRichText | notionInputNumber | notionInputCheckbox | notionInputTitle;
}




