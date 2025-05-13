export enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug",
}

export interface LoggerConfig {
    level: LogLevel;
    format: "json" | "simple";
    timestamp: boolean;
    colorize: boolean;
    logToFile: boolean;
    logFilePath?: string;
    logToConsole: boolean;
}

export const loggerConfig: LoggerConfig = {
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.DEBUG,
    format: (process.env.LOG_FORMAT as "json" | "simple") || "json",
    timestamp: process.env.LOG_TIMESTAMP !== "false",
    colorize: process.env.LOG_COLORIZE !== "false",
    logToFile: process.env.LOG_TO_FILE === "true",
    logFilePath: process.env.LOG_FILE_PATH || "logs/application.log",
    logToConsole: process.env.LOG_TO_CONSOLE !== "false",
};
