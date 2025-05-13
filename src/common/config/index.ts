import { appConfig } from "./providers/app.config.js";
import { telegramConfig } from "./providers/telegram.config.js";
import { storageConfig } from "./providers/storage.config.js";

export const config = {
    app: appConfig,
    telegram: telegramConfig,
    storage: storageConfig,
};

export { appConfig, telegramConfig, storageConfig };

export type { AppConfig } from "./schemas/app.schema.js";
export type { TelegramConfig } from "./schemas/telegram.schema.js";
export type { StorageConfig } from "./schemas/storage.schema.js";
