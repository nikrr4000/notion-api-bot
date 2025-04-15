import EventEmitterFactory from "./EventEmitterFactory.js"

export const createLocalEventEmitter = () => new EventEmitterFactory()
export const {
    emitterOn: globalEmitterOn,
    emitterEmit: globalEmitterEmit,
    emitterOff: globalEmitterOff,
    emitter: globalEmitter
} = new EventEmitterFactory().getEmitterMethods()
export * from "./utils.js"
