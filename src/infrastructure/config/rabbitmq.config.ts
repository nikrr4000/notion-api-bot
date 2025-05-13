export interface RabbitMQConfig {
    url: string;
    exchangeName: string;
    queueName: string;
    reconnectInterval: number;
    prefetchCount: number;
}

export const rabbitmqConfig: RabbitMQConfig = {
    url: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    exchangeName: process.env.RABBITMQ_EXCHANGE || "voice_recognition_events",
    queueName: process.env.RABBITMQ_QUEUE || "voice_recognition_queue",
    reconnectInterval: Number(process.env.RABBITMQ_RECONNECT_INTERVAL || "5000"),
    prefetchCount: Number(process.env.RABBITMQ_PREFETCH_COUNT || "10"),
};
