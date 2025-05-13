
import { globalEmitterOn } from "#root/events/index.js";
import { VoiceToNotionAgent } from "./VoiceToNotionAgent.js";

class StrategyAgent {
    constructor() {
        this.init()
    }
    // TODO: Create dynamically created listeners
    private init() {
        globalEmitterOn<ReceivedAudioRequestCtx>("telegram:recognize-voice", this.voiceToNotion())
    }

    voiceToNotion() {
        return (data: ReceivedAudioRequestCtx) => new VoiceToNotionAgent(data)
    }
}

export default () => new StrategyAgent()