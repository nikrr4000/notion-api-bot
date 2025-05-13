import sanitizedConfig from "#root/old/config.js";

const dbId = sanitizedConfig.NOTION_DB_ID;

export const getInfo = async () => {
    // const response = await notion.pages.create(
    //     {
    //         parent: {
    //             database_id: dbId
    //         },
    //         properties: requestObj
    //     }
    // )
    // console.log(response);
    // const newDatabase = await notion.databases.query({ database_id: dbId })
    // const listUsersResponse = await notion.users.list({})
    // const page = newDatabase.results[0]
    // if (!isFullPage(page)) return
    // const properties = page.properties
    // // if (!isFilmTable(properties)) return
    // if (!isPropertyObj(properties)) return
    // console.log(newDatabase);
};
