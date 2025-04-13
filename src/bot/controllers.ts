import { emitterEmit } from "#root/EventController.js"

export const emitVoiceRecognizeRequest = (data: ReceivedAudioRequestCtx) => {
    emitterEmit("telegram:voice", data)
}