import { emitterEmit } from "#root/EventController.js";
import downloadToUploadStream from "#root/utils/downloadToUploadStream.js";
import storage from "#sdk/aws/client.js"
import config from "#sdk/config.js";
import path from "node:path";

// TODO: Make class structure more independent from bot api. Or not?
export class VoiceToNotionAgent {
    private chatId: number;
    private userId: number;
    private downloadUrl: string

    constructor({ chatId, userId, downloadUrl }: ReceivedAudioRequestCtx) {
        this.chatId = chatId
        this.userId = userId
        this.downloadUrl = downloadUrl

        this.main()
    }

    private async main() {
        const downloadUrl = await this.uploadDataProcessing()
        if (!downloadUrl) return


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
        return path.join(storageEndpoint, voiceBucket, streamObj.name)
    }
    // private processVoiceRecognize (url:string, objName: string){
    //     emitterEmit("stt:recognize")
    // }
}
