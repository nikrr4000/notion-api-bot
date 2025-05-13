import { baseConfig } from "./base.js";

export const productionConfig = {
    ...baseConfig,

    app: {
        ...baseConfig.app,
        logLevel: "info",
    },

    telegram: {
        ...baseConfig.telegram,
        useWebhook: true,
    },
};
