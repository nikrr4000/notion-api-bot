// import { RichTextPropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints.js"

// type FilmsTable = {
//     Watched: { id: string, type: ColumnTypeValues, checkbox: boolean },
//     IMBd: { id: string, type: ColumnTypeValues, number: null | number },
//     Kinopisk: { id: string, type: ColumnTypeValues, number: null | number },
//     'Rating-personal': { id: string, type: ColumnTypeValues, number: null | number },
//     Synopsis: RichTextPropertyItemObjectResponse,
//     // Director: { id: string, type: ColumnTypeValues, people: [] },
//     // Genre: { id: string, type: ColumnTypeValues, multi_select: [] },
//     Name: TitleColumnType
// }

// type TitleColumnType = { id: string, type: "title", title: TitleType[] }
// type TextColumnType = { id: string, type: "rich_text", title: RichTextType[] }
// type NumberColumnType = { id: string, type: "number", number: null | number }
// type CheckboxColumnType = { id: string, type: "checkbox", checkbox: boolean }


// type AnnotationsType = {
//     bold: boolean,
//     italic: boolean,
//     strikethrough: boolean,
//     underline: boolean,
//     code: boolean,
//     color: string
// }

// type TitleType = {
//     type: string,
//     text: {
//         content: string,
//         link: null | string
//     },
//     annotations: AnnotationsType,
//     plain_text: string,
//     href: null | string
// }

// type RichTextType = TitleType