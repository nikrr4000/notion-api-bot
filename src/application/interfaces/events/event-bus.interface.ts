import { Event } from "./event.interface.js";

export interface EventBus {
    /**
     * Публикация события в шину
     * @param event Событие для публикации
     */
    publish<T extends Event>(event: T): Promise<void>;

    /**
     * Подписка на события определенного типа
     * @param eventType Тип события
     * @param handler Обработчик события
     */
    subscribe<T extends Event>(eventType: string, handler: EventHandler<T>): Promise<void>;

    /**
     * Отписка от событий определенного типа
     * @param eventType Тип события
     * @param handler Обработчик события
     */
    unsubscribe<T extends Event>(eventType: string, handler: EventHandler<T>): Promise<void>;
}

export type EventHandler<T extends Event> = (event: T) => Promise<void> | void;
