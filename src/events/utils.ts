import EventController from "./EventEmitterFactory.js";
import { createLocalEventEmitter } from "#root/events/index.js"

type EventEmitterEnhanced = {
    event: ReturnType<typeof createLocalEventEmitter>;
};
export const addEventListener = <T>(obj: T): T & EventEmitterEnhanced => {
    const eventEmitter: ReturnType<typeof createLocalEventEmitter> = createLocalEventEmitter();
    const enhancedObj = obj as T & EventEmitterEnhanced;
    enhancedObj.event = eventEmitter;

    return obj as T & EventEmitterEnhanced;
}

export const createEventRequestResultHandlers = (eventController: EventController, success: events.EventMessages, error: events.EventMessages) => {
    let resolveHandler: <T>(data: T) => void
    let rejectHandler: typeof resolveHandler

    return new Promise((resolve, reject) => {
        resolveHandler = (data) => resolve(data)
        rejectHandler = (data) => reject(data)

        eventController.emitterOn(success, resolveHandler);
        eventController.emitterOn(error, rejectHandler);
    }).finally(() => {
        eventController.emitterOff(success, resolveHandler);
        eventController.emitterOff(error, rejectHandler);
    });
}