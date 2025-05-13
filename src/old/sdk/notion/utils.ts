import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints.js"
import propertiesFillers from "./propertiesFillers.js"

const convertNotionInputToNotionReqObj = (input: notionInput): CreatePageParameters | null => {
    const inputEntries = Object.entries(input)

    let foundWrongField = false
    const propertyObj = inputEntries.reduce<PropertyObj>((acc, [name, dataObj]) => {
        const { type, data } = dataObj as notionInput
        // FIXME: I tried to use acc[name] = propertiesFillers[type](data) but it threw an error with never type
        if (type === 'rich_text')
        {
            acc[name] = propertiesFillers.rich_text(data as string);
        } else if (type === 'number')
        {
            acc[name] = propertiesFillers.number(data as number);
        } else if (type === 'checkbox')
        {
            acc[name] = propertiesFillers.checkbox(data as boolean);
        } else if (type === 'title')
        {
            acc[name] = propertiesFillers.title(data as string);
        } else
        {
            foundWrongField = true
        }

        return acc
    }, {})
    if (foundWrongField) return null
    return propertyObj
}

const writeNotionPage = (properties: CreatePageParameters, dbId: string) => {

}