
import { emitterOn } from "#root/EventController.js";
import { VoiceToNotionAgent } from "./VoiceToNotionAgent.js";

export const initializeEmitters = () => {
    emitterOn<ReceivedAudioRequestCtx>("telegram:voice", (data) => new VoiceToNotionAgent(data))
}