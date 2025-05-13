import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

export type NodeEnv = "development" | "production" | "test";

export function getNodeEnv(): NodeEnv {
    const env = process.env.NODE_ENV || "development";

    if (env !== "development" && env !== "production" && env !== "test") {
        console.warn(`Unknown NODE_ENV: ${env}, falling back to 'development'`);
        return "development";
    }

    return env as NodeEnv;
}

export function loadEnv(): void {
    const nodeEnv = getNodeEnv();

    const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
    const defaultEnvPath = path.resolve(process.cwd(), ".env");

    if (fs.existsSync(envPath)) {
        const result = dotenv.config({ path: envPath });

        if (result.error) {
            throw new Error(`Error loading .env.${nodeEnv} file: ${result.error.message}`);
        }

        console.log(`Loaded environment variables from ${envPath}`);
        return;
    }

    if (fs.existsSync(defaultEnvPath)) {
        const result = dotenv.config({ path: defaultEnvPath });

        if (result.error) {
            throw new Error(`Error loading .env file: ${result.error.message}`);
        }

        console.log(`Loaded environment variables from ${defaultEnvPath}`);
        return;
    }

    console.warn("No .env file found, using existing environment variables");
}

loadEnv();
