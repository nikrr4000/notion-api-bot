import { Logger } from "#application/interfaces/logger.interface.js";
import { WinstonLoggerAdapter } from "./winston-logger.js";

export const logger: Logger = new WinstonLoggerAdapter();

export { WinstonLoggerAdapter };
