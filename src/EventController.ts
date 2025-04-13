import { EventEmitter } from "events"

class EventController {
    private emitter: EventEmitter
    public emitterOn: <T>(eventName: EventMessages, listener: (message: T) => void) => void
    public emitterEmit: <T>(eventName: EventMessages, message: T) => void
    public emitterOff: <T>(eventName: EventMessages, listener: (...args: any[]) => void) => void

    constructor() {
        this.emitter = new EventEmitter();
        this.emitterOn = this.emitter.on.bind(this.emitter)
        this.emitterEmit = this.emitter.emit.bind(this.emitter)
        this.emitterOff = this.emitter.off.bind(this.emitter)
    }
}

const { emitterOn, emitterEmit } = new EventController()
export { emitterOn, emitterEmit };