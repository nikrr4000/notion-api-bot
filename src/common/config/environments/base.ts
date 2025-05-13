// common/config/environments/base.ts
import { getNodeEnv } from "../env.js";

const nodeEnv = getNodeEnv();

export const baseConfig = {
    isProduction: nodeEnv === "production",
    isDevelopment: nodeEnv === "development",
    isTest: nodeEnv === "test",

    app: {
        port: Number(process.env.PORT || 3000),
        host: process.env.HOST || "0.0.0.0",
        apiPrefix: process.env.API_PREFIX || "/api",
        logLevel: process.env.LOG_LEVEL || (nodeEnv === "production" ? "info" : "debug"),
    },

    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN || "",
        webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
        useWebhook: process.env.TELEGRAM_USE_WEBHOOK === "true",
        admins: process.env.TELEGRAM_ADMINS ? process.env.TELEGRAM_ADMINS.split(",").map(Number) : [],
    },

    storage: {
        aws: {
            region: process.env.AWS_REGION || "ru-central1",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            s3: {
                bucket: process.env.AWS_S3_BUCKET || "voice-container",
                endpoint: process.env.AWS_S3_ENDPOINT || "https://storage.yandexcloud.net",
                publicUrlExpiration: Number(process.env.AWS_S3_URL_EXPIRATION || 3600),
            },
        },
    },
    yandex: {
        apiKey: process.env.YANDEX_API_KEY || "",
        folderId: process.env.YANDEX_FOLDER_ID || "",
        operationPollingDelay: Number(process.env.YANDEX_POLLING_DELAY || 2000),
    },
};
