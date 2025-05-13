import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "node:path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

type envKeys = "BOT_TOKEN" | "NOTION_API_KEY" | "YC_FOLDER_ID" | "YC_AUTH_KEY_ID" | "YC_AUTH_SERVICE_ACCOUNT_ID" | "YC_AUTH_PRIVATE_KEY" | "AWS_ACCESS_KEY_ID"
    | "AWS_SECRET_ACCESS_KEY" | "NOTION_DB_ID";

type ENV = Record<envKeys, string | undefined>;
type Config = Record<envKeys, string>;

// Loading process.env as ENV interface
const getConfig = (): ENV => {
    return {
        BOT_TOKEN: process.env.BOT_TOKEN,
        NOTION_API_KEY: process.env.NOTION_API_KEY,
        NOTION_DB_ID: process.env.NOTION_DB_ID,
        YC_FOLDER_ID: process.env.YC_FOLDER_ID,
        YC_AUTH_KEY_ID: process.env.YC_AUTH_KEY_ID,
        YC_AUTH_SERVICE_ACCOUNT_ID: process.env.YC_AUTH_SERVICE_ACCOUNT_ID,
        YC_AUTH_PRIVATE_KEY: process.env.YC_AUTH_PRIVATE_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    };
};

const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config))
    {
        if (!value)
        {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
