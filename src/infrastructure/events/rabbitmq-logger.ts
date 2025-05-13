import { logger } from "../logger/index.js";

export const rabbitmqLogger = logger.child({
    module: "rabbitmq",
    component: "event-bus",
});
