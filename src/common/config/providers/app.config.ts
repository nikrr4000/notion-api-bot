import { appConfigSchema, AppConfig } from "../schemas/app.schema.js";
import { validateConfig } from "../validation.js";
import { getNodeEnv } from "../env.js";
import { developmentConfig } from "../environments/development.js";
import { productionConfig } from "../environments/production.js";
import { testConfig } from "../environments/test.js";

export function createAppConfig(): AppConfig {
    const nodeEnv = getNodeEnv();

    let config: unknown;

    switch (nodeEnv) {
        case "development":
            config = developmentConfig.app;
            break;
        case "production":
            config = productionConfig.app;
            break;
        case "test":
            config = testConfig.app;
            break;
        default:
            config = developmentConfig.app;
    }

    return validateConfig(appConfigSchema, config, "App config validation error");
}

export const appConfig = createAppConfig();
