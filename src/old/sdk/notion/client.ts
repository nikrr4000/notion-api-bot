import sanitizedConfig from "#root/old/config.js";
import { Client } from "@notionhq/client";

export default new Client({
    auth: sanitizedConfig.NOTION_API_KEY,
});
