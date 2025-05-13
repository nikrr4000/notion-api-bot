// common/config/providers/storage.config.ts
import { storageConfigSchema, StorageConfig } from "../schemas/storage.schema.js";
import { validateConfig } from "../validation.js";
import { getNodeEnv } from "../env.js";
import { developmentConfig } from "../environments/development.js";
import { productionConfig } from "../environments/production.js";
import { testConfig } from "../environments/test.js";

export function createStorageConfig(): StorageConfig {
    const nodeEnv = getNodeEnv();

    let config: unknown;

    switch (nodeEnv) {
        case "development":
            config = developmentConfig.storage;
            break;
        case "production":
            config = productionConfig.storage;
            break;
        case "test":
            config = testConfig.storage;
            break;
        default:
            config = developmentConfig.storage;
    }

    return validateConfig(storageConfigSchema, config, "Storage config validation error");
}

export const storageConfig = createStorageConfig();
