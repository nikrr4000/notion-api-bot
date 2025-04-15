import { createEventRequestResultHandlers, globalEmitterEmit, addEventListener } from "#root/events/index.js"

const registerWaiter = () => {
    // globalEmitterOn("telegram:recognize-voice:error")
}

export const emitVoiceRecognizeRequest = (data: Omit<ReceivedAudioRequestCtx, "resultWaiterData">) => {
    const ctxWithEmitter = addEventListener(data)
    const [success, error] = ["telegram:recognize-voice:result", "telegram:recognize-voice:error"] as events.TelegramEventMessage[]
    createEventRequestResultHandlers(ctxWithEmitter.event, success, error)
    const ctxWithWaiterData = {
        ...ctxWithEmitter,
        resultWaiterData: {
            resultListeners: {
                success,
                error
            }
        }
    } as ReceivedAudioRequestCtx

    globalEmitterEmit("telegram:recognize-voice", ctxWithEmitter)
}