import downloadToUploadStream from "#root/utils/downloadToUploadStream.js";
import storage from "#sdk/aws/client.js"
import config from "#sdk/config.js";
import type EventController from "#root/events/EventEmitterFactory.js";
import { createEventRequestResultHandlers, globalEmitterEmit } from "#root/events/index.js";

// TODO: Make class structure more independent from bot api. Or not?
export class VoiceToNotionAgent {
    private resultWaiterData: WaitersType;
    private downloadUrl: string;

    constructor(ctx: ReceivedAudioRequestCtx) {
        this.resultWaiterData = ctx.resultWaiterData;
        this.downloadUrl = ctx.downloadUrl;

        this.main(ctx);
    }

    private async main(ctx: ReceivedAudioRequestCtx) {
        console.log('voice to notion init');
        const bucketUrl = await this.uploadDataProcessing()
        if (!bucketUrl) return

        const [success, error] = ["stt:recognize:result", "stt:recognize:error"] as events.EventMessages[];
        const sttResultPromise = createEventRequestResultHandlers(ctx.event, success, error)
        this.recognizeVoiceMessage(bucketUrl, ctx.event)
        console.log('waiting for stt result');
        const sttResult = await sttResultPromise
        console.log('got stt result: ', sttResult);
    }

    private createDownloadStream() {
        return downloadToUploadStream(this.downloadUrl)
    }
    private async uploadDataProcessing() {
        const streamObj = await this.createDownloadStream()
        if (!streamObj) return null;
        // TODO: Handle uploading output
        const res = await storage.uploadObject(streamObj)
        const { storageEndpoint, voiceBucket } = config.yc

        return `${storageEndpoint}/${voiceBucket}/${streamObj.name}`
    }

    private recognizeVoiceMessage(bucketUrl: string, eventController: EventController) {
        globalEmitterEmit<stt.recognizeRequestObj>("stt:recognize", {
            bucketUrl,
            eventController
        })
    }
}