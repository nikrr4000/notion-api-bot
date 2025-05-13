// infrastructure/events/rabbitmq-event-bus.ts
import { EventBus, EventHandler } from "#application/interfaces/events/event-bus.interface.js";
import { Event } from "#application/interfaces/events/event.interface.js";
import { RabbitMQConnection, rabbitMQConnection } from "./rabbitmq.connection.js";
import { rabbitmqConfig } from "../config/rabbitmq.config.js";
import { rabbitmqLogger as logger } from "./rabbitmq-logger.js";

export class RabbitMQEventBus implements EventBus {
    private readonly connection: RabbitMQConnection;
    private readonly handlers: Map<string, Set<EventHandler<any>>> = new Map();
    private initialized = false;

    constructor(connection: RabbitMQConnection = rabbitMQConnection) {
        this.connection = connection;
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        await this.connection.initialize();
        await this.setupConsumer();
        this.initialized = true;
    }

    private async setupConsumer(): Promise<void> {
        const channel = await this.connection.getChannel();

        await channel.assertQueue(rabbitmqConfig.queueName, {
            durable: true,
            autoDelete: false,
        });

        // Привязка очереди к обмену по всем ключам маршрутизации (типам событий)
        await channel.bindQueue(rabbitmqConfig.queueName, rabbitmqConfig.exchangeName, "#");

        channel.consume(rabbitmqConfig.queueName, async (msg) => {
            if (!msg) {
                return;
            }

            try {
                const contentString = msg.content.toString();
                const eventData = JSON.parse(contentString);
                const eventType = eventData.type;

                const handlers = this.handlers.get(eventType);

                if (handlers) {
                    for (const handler of handlers) {
                        try {
                            await Promise.resolve(handler(eventData));
                        } catch (handlerError) {
                            logger.error(`Error in event handler for ${eventType}:`, handlerError);
                        }
                    }
                }

                channel.ack(msg);
            } catch (error) {
                logger.error("Error processing message:", error);
                // В случае ошибки обработки, сообщение возвращается в очередь
                channel.nack(msg, false, true);
            }
        });
    }

    async publish<T extends Event>(event: T): Promise<void> {
        await this.ensureInitialized();

        const channel = await this.connection.getChannel();
        const content = Buffer.from(JSON.stringify(event));

        const result = channel.publish(rabbitmqConfig.exchangeName, event.type, content, {
            persistent: true,
        });

        if (!result) {
            throw new Error(`Failed to publish event of type: ${event.type}`);
        }

        logger.debug(`Published event: ${event.type}`);
    }

    async subscribe<T extends Event>(eventType: string, handler: EventHandler<T>): Promise<void> {
        await this.ensureInitialized();

        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }

        this.handlers.get(eventType)!.add(handler);
        logger.debug(`Subscribed to event: ${eventType}`);
    }

    async unsubscribe<T extends Event>(eventType: string, handler: EventHandler<T>): Promise<void> {
        if (!this.handlers.has(eventType)) {
            return;
        }

        const handlers = this.handlers.get(eventType)!;
        handlers.delete(handler);

        if (handlers.size === 0) {
            this.handlers.delete(eventType);
        }

        logger.debug(`Unsubscribed from event: ${eventType}`);
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }
}

// Singleton
export const rabbitmqEventBus = new RabbitMQEventBus();
