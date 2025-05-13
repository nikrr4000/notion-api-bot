// presentation/bot/middlewares/extend-context.middleware.ts
import { NextFunction } from "grammy";
import { BotContext } from "../types.js";
import { logger } from "#infrastructure/logger/index.js";

export function extendContextMiddleware() {
    return async (ctx: BotContext, next: NextFunction) => {
        try {
            if (ctx.from?.id) {
                ctx.userId = ctx.from.id;
            }

            await next();
        } catch (error) {
            logger.error("Error in extend context middleware", error);
            await next();
        }
    };
}
