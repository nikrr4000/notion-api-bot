import { telegramConfigSchema, TelegramConfig } from "../schemas/telegram.schema.js";
import { validateConfig } from "../validation.js";
import { getNodeEnv } from "../env.js";
import { developmentConfig } from "../environments/development.js";
import { productionConfig } from "../environments/production.js";
import { testConfig } from "../environments/test.js";

export function createTelegramConfig(): TelegramConfig {
    const nodeEnv = getNodeEnv();

    let config: unknown;

    switch (nodeEnv) {
        case "development":
            config = developmentConfig.telegram;
            break;
        case "production":
            config = productionConfig.telegram;
            break;
        case "test":
            config = testConfig.telegram;
            break;
        default:
            config = developmentConfig.telegram;
    }

    return validateConfig(telegramConfigSchema, config, "Telegram config validation error");
}

// Создаем экземпляр конфигурации при импорте
export const telegramConfig = createTelegramConfig();
