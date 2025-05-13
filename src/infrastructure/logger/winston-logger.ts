// infrastructure/logger/winston-logger.ts
import { createLogger, format, transports, Logger as WinstonLogger } from "winston";
import { Logger } from "#application/interfaces/logger.interface.js";
import { LoggerConfig, loggerConfig } from "../config/logger.config.js";
import * as path from "path";
import * as fs from "fs";

export class WinstonLoggerAdapter implements Logger {
    private logger: WinstonLogger;

    constructor(private config: LoggerConfig = loggerConfig) {
        this.logger = this.createWinstonLogger();
    }

    private createWinstonLogger(): WinstonLogger {
        const formatters = [
            this.config.timestamp
                ? format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" })
                : format.timestamp(),
            format.errors({ stack: true }),
            format.splat(),
        ];

        if (this.config.format === "json") {
            formatters.push(format.json());
        } else {
            formatters.push(
                format.printf(({ level, message, timestamp, ...rest }) => {
                    const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : "";
                    return `${timestamp} ${level}: ${message}${meta}`;
                }),
            );
        }

        if (this.config.colorize) {
            formatters.push(format.colorize());
        }

        const loggerFormat = format.combine(...formatters);

        const loggerTransports = [];

        if (this.config.logToConsole) {
            loggerTransports.push(new transports.Console());
        }

        if (this.config.logToFile && this.config.logFilePath) {
            const logDir = path.dirname(this.config.logFilePath);

            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            loggerTransports.push(
                new transports.File({
                    filename: this.config.logFilePath,
                    maxsize: 10 * 1024 * 1024, // 10MB
                    maxFiles: 5,
                    tailable: true,
                }),
            );
        }

        return createLogger({
            level: this.config.level,
            format: loggerFormat,
            transports: loggerTransports,
            exitOnError: false,
        });
    }

    debug(message: string, ...meta: any[]): void {
        this.logger.debug(message, ...meta);
    }

    info(message: string, ...meta: any[]): void {
        this.logger.info(message, ...meta);
    }

    warn(message: string, ...meta: any[]): void {
        this.logger.warn(message, ...meta);
    }

    error(message: string, error?: unknown, ...meta: any[]): void {
        if (error instanceof Error) {
            this.logger.error(message, { error: error.message, stack: error.stack, ...meta });
        } else if (error) {
            this.logger.error(message, { error, ...meta });
        } else {
            this.logger.error(message, ...meta);
        }
    }

    child(options: Record<string, unknown>): Logger {
        const childAdapter = new WinstonLoggerAdapter(this.config);
        childAdapter.logger = this.logger.child(options);
        return childAdapter;
    }
}
