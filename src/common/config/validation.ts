import { z } from "zod";
import { getNodeEnv } from "./env.js";

export function validateConfig<T>(
    schema: z.ZodType<T>,
    data: unknown,
    errorPrefix = "Config validation error",
): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const details = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");

            throw new Error(`${errorPrefix}:\n${details}`);
        }

        throw error;
    }
}

export function createEnvSpecificSchema<T>(
    developmentSchema: z.ZodType<T>,
    productionSchema: z.ZodType<T>,
    testSchema: z.ZodType<T>,
): z.ZodType<T> {
    const nodeEnv = getNodeEnv();

    switch (nodeEnv) {
        case "development":
            return developmentSchema;
        case "production":
            return productionSchema;
        case "test":
            return testSchema;
        default:
            return developmentSchema;
    }
}
