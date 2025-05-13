export interface Config {
    aws: AwsConfig;
    yandex: YandexConfig;
    notion: NotionConfig;
    telegram: TelegramConfig;
}

export interface AwsConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3: {
        bucket: string;
        endpoint?: string;
        publicUrlExpiration: number;
    };
}

export interface YandexConfig {
    privateKey: string;
    folderId: string;
    apiKey: string;
    operationPollingDelay: number;
}

export interface NotionConfig {
    apiKey: string;
    databaseId: string;
}

export interface TelegramConfig {
    token: string;
    useWebhook: boolean;
    webhookUrl: string;
}

export const config: Config = {
    aws: {
        region: process.env.AWS_REGION || "ru-central1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        s3: {
            bucket: process.env.AWS_S3_BUCKET || "voice-container",
            endpoint: process.env.AWS_S3_ENDPOINT || "https://storage.yandexcloud.net",
            publicUrlExpiration: parseInt(process.env.AWS_S3_URL_EXPIRATION || "3600", 10),
        },
    },
    yandex: {
        privateKey: process.env.YANDEX_PRIVATE_KEY || "",
        folderId: process.env.YANDEX_FOLDER_ID || "",
        apiKey: process.env.YANDEX_API_KEY || "",
        operationPollingDelay: parseInt(process.env.YANDEX_POLLING_DELAY || "2000", 10),
    },
    notion: {
        apiKey: process.env.NOTION_API_KEY || "",
        databaseId: process.env.NOTION_DATABASE_ID || "",
    },
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN || "",
        useWebhook: !!process.env.TELEGRAM_BOT_USE_WEBHOOK || false,
        webhookUrl: process.env.TELEGRAM_BOT_WEBHOOK_URL || "",
    },
};
