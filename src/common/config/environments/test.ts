import { baseConfig } from "./base.js";

export const testConfig = {
    ...baseConfig,

    app: {
        ...baseConfig.app,
        port: 3001,
        logLevel: "debug",
    },

    storage: {
        ...baseConfig.storage,
        aws: {
            ...baseConfig.storage.aws,
            region: "us-east-1",
            accessKeyId: "test-key",
            secretAccessKey: "test-secret",
            s3: {
                ...baseConfig.storage.aws.s3,
                bucket: "test-bucket",
                endpoint: "http://localhost:4566",
            },
        },
        yandex: {
            ...baseConfig.storage.yandex,
            apiKey: "test-key",
            folderId: "test-folder",
        },
    },
};
