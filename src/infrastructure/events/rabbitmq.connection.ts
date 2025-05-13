// infrastructure/events/rabbitmq.connection.ts
import { ChannelModel, Channel, connect } from "amqplib";
import { RabbitMQConfig, rabbitmqConfig } from "../config/rabbitmq.config.js";
import { rabbitmqLogger as logger } from "./rabbitmq-logger.js";

export class RabbitMQConnection {
    private connection: ChannelModel | null = null;
    private channel: Channel | null = null;
    private readonly config: RabbitMQConfig;
    private connecting = false;
    private reconnectTimer: NodeJS.Timeout | null = null;

    constructor(config: RabbitMQConfig = rabbitmqConfig) {
        this.config = config;
    }

    async initialize(): Promise<void> {
        if (this.connection && this.channel) {
            return;
        }

        if (this.connecting) {
            return;
        }

        this.connecting = true;

        try {
            this.connection = await connect(this.config.url);

            this.connection.on("error", (err) => {
                logger.error("RabbitMQ connection error", err);
                this.scheduleReconnect();
            });

            this.connection.on("close", () => {
                logger.warn("RabbitMQ connection closed");
                this.scheduleReconnect();
            });

            this.channel = await this.connection.createChannel();
            this.channel.prefetch(this.config.prefetchCount);

            await this.channel.assertExchange(this.config.exchangeName, "topic", { durable: true });

            const queueResult = await this.channel.assertQueue(this.config.queueName, {
                durable: true,
                autoDelete: false,
            });

            logger.info(`Connected to RabbitMQ queue: ${queueResult.queue}`);
            this.connecting = false;
        } catch (error) {
            logger.error("Failed to connect to RabbitMQ", error);
            this.connecting = false;
            this.scheduleReconnect();
            throw error;
        }
    }

    private scheduleReconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        this.reconnectTimer = setTimeout(async () => {
            logger.info("Attempting to reconnect to RabbitMQ...");
            try {
                this.connection = null;
                this.channel = null;
                await this.initialize();
                logger.info("Successfully reconnected to RabbitMQ");
            } catch (error) {
                logger.error("Failed to reconnect to RabbitMQ", error);
            }
        }, this.config.reconnectInterval);
    }

    async getChannel(): Promise<Channel> {
        if (!this.channel) {
            await this.initialize();
        }

        if (!this.channel) {
            throw new Error("RabbitMQ channel is not available");
        }

        return this.channel;
    }

    async close(): Promise<void> {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.channel) {
            await this.channel.close();
            this.channel = null;
        }

        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
    }
}

export const rabbitMQConnection = new RabbitMQConnection();
