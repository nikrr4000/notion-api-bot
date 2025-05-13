import { EventEmitter } from "node:events"

export default class EventController {
    public emitter: EventEmitter
    public emitterOn: events.EmitterOn
    public emitterEmit: events.EmitterEmit;
    public emitterOff: events.EmitterOff;

    constructor() {
        this.emitter = new EventEmitter();
        this.emitterOn = this.emitter.on.bind(this.emitter)
        this.emitterEmit = this.emitter.emit.bind(this.emitter)
        this.emitterOff = this.emitter.off.bind(this.emitter)
    }
    getEmitterMethods() {
        return {
            emitter: this.emitter,
            emitterOn: this.emitterOn,
            emitterEmit: this.emitterEmit,
            emitterOff: this.emitterOff
        }
    }
}