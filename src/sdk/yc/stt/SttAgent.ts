import {
    serviceClients, cloudApi,
    type Session
} from '@yandex-cloud/nodejs-sdk';
import ycAgent from "../client.js";
import { globalEmitterOn } from '#root/events/index.js';
import type EventController from '#root/events/EventEmitterFactory.js';
import type { Operation } from '@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/operation/operation.js';

const {
    operation: {
        operation_service: { GetOperationRequest }
    },
    ai: {
        stt_service: {
            LongRunningRecognitionRequest,
            LongRunningRecognitionResponse
        }
    }
} = cloudApi;

class SttAgent {
    private session: Session;
    private folderId: string;

    constructor() {
        this.session = this.initializeSession()
        this.folderId = this.initializeFolderId()

        this.initializeListeners()
    }

    private initializeSession() {
        return ycAgent.getSession()
    }
    private initializeFolderId() {
        return ycAgent.getFolderId()
    }
    // FIXME: Create automatic initialization
    public initializeListeners() {
        globalEmitterOn("stt:recognize", (data: stt.recognizeRequestObj) => this.main(data))
    }

    private async main(req: stt.recognizeRequestObj) {
        const { bucketUrl, eventController } = req
        const requestOpId = await this.createRecognizeRequest(bucketUrl)
        this.intervalOpResponseRequesting(requestOpId.id, eventController)
    }

    private requestResultHandler(eventController: EventController, resObj: ResultObj<string | null>) {
        if (resObj.error || (!resObj.result && !resObj.info))
        {
            eventController.emitterEmit("stt:recognize:error", resObj)
        }
        eventController.emitterEmit("stt:recognize:result", resObj)

    }

    private createRecognizeRequest(uri: string) {
        const speechkitClient = this.session.client(serviceClients.SttServiceClient)
        const recognizeRequest = LongRunningRecognitionRequest.fromPartial({
            config: {
                folderId: this.folderId,
                specification: {
                    literatureText: true
                }
            },
            audio: {
                uri
            }
        })
        return speechkitClient.longRunningRecognize(recognizeRequest)
    }

    // TODO: Maybe it's better to separate eventController obj from intervalOpResponseRequesting
    private intervalOpResponseRequesting(opId: string, eventController: EventController) {
        const resObj = { result: null, error: null } as ResultObj<string | null>
        let isRequesting = false;
        // TODO: add limiter
        // let requestLimit = 5
        const interval = setInterval(async () => {
            if (isRequesting) return;

            try
            {
                isRequesting = true;
                const opResponse = await this.processIntervalRequesting(opId);
                if (opResponse.done)
                {
                    clearInterval(interval);
                    const resData = this.decodeResponse(opResponse)
                    const resStr = this.extractTextFromSttResponse(resData)

                    resObj.result = resStr
                }
            } catch (e)
            {
                const err = e as Error
                console.error('Error during operation status check:', err);
                resObj.error = `Error during operation status check: ${err.message}`
            } finally
            {
                if (resObj.error || resObj.result)
                {
                    this.requestResultHandler(eventController, resObj)
                }
                isRequesting = false;
            }
        }, 1000);

        return interval;
    }

    private async processIntervalRequesting(opId: string): Promise<Operation> {
        return this.getOpResponse(opId);

    }

    private async getOpResponse(opId: string) {
        try
        {
            const opClient = this.session.client(serviceClients.OperationServiceClient)
            const opRequest = GetOperationRequest.fromPartial({ operationId: opId })
            return opClient.get(opRequest)
        } catch (e)
        {
            const err = e as Error
            console.error('Error getting op response:', err);
            throw new Error(`Error during operation inside getOpResponse: ${err.message}`)
        }
    }

    private decodeResponse(operation: cloudApi.operation.operation.Operation) {
        if (!operation.response) throw new Error('decodeResponse error: Empty response')
        if (!operation.response.value) throw new Error('decodeResponse error: Empty response value')
        const opValue = operation.response.value
        return LongRunningRecognitionResponse.decode(opValue)
    }

    private extractTextFromSttResponse(response: cloudApi.ai.stt_service.LongRunningRecognitionResponse) {
        const { chunks } = response
        return chunks.reduce((acc, chunk) => {
            return acc.concat(` ${chunk.alternatives[0].text}`)
        }, '')
    }
}

export default new SttAgent()