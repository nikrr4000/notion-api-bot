import { baseConfig } from "./base.js";

export const developmentConfig = {
    ...baseConfig,

    app: {
        ...baseConfig.app,
        port: 3000,
        logLevel: "debug",
        isDevelopment: true,
        isProduction: false,
    },

    storage: {
        ...baseConfig.storage,
        aws: {
            ...baseConfig.storage.aws,
            s3: {
                ...baseConfig.storage.aws.s3,
            },
        },
    },
};
