import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints.js";

type PropertyValue = CreatePageParameters['properties'][string];

type PropertiesFillers = {
    // TODO: Add supporting of other fields
    rich_text: (plain_text: string) => PropertyValue;
    number: (number: number) => PropertyValue;
    checkbox: (flag: boolean) => PropertyValue;
    title: (title: string) => PropertyValue;
}


// FIXME: Now propertiesFillers returns array but it shouldn't. It can be an obstacle for scaling
// TODO: create complete rich_text filler-function
const propertiesFillers: PropertiesFillers = {
    "rich_text": (plain_text: string) => ({
        type: 'rich_text',
        rich_text: [
            {
                type: "text",
                text: {
                    content: plain_text,
                    link: null
                },
                annotations: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default'
                },
                plain_text,
                href: null
            }
        ]
    }),
    "number": (number: number) => ({ type: "number", number: number }),
    "checkbox": (flag: boolean) => ({ type: "checkbox", checkbox: flag }),
    "title": (title: string) => ({
        type: 'title',
        title: [{
            type: 'text',
            text: {
                content: title,
                link: null
            },
            annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default'
            },
            plain_text: title,
            href: null
        }]
    })
}

export default propertiesFillers