import {
    serviceClients, cloudApi,
    type Session
} from '@yandex-cloud/nodejs-sdk';
import ycAgent from "./client.js";

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

class sttAgent {
    private session: Session;
    private folderId: string;

    constructor() {
        this.session = this.initializeSession()
        this.folderId = this.initializeFolderId()
    }

    private initializeSession() {
        return ycAgent.getSession()
    }
    private initializeFolderId() {
        return ycAgent.getFolderId()
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

    private intervalOpResponseRequesting(opId: string) {
        let isRequesting = false;
        // TODO: add limiter
        // let requestLimit = 5
        const interval = setInterval(async () => {
            if (isRequesting) return;

            try
            {
                isRequesting = true;
                const isDone = await this.processIntervalRequesting(opId);
                if (isDone)
                {
                    clearInterval(interval);
                }
            } catch (e)
            {
                const err = e as Error
                console.error('Error during operation status check:', err);
                throw new Error(`Error during operation status check: ${err.message}`)
            } finally
            {
                isRequesting = false;
            }
        }, 5000);

        return interval;
    }

    private async processIntervalRequesting(opId: string): Promise<boolean> {
        const response = await this.getOpResponse(opId);
        return response.done;
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

export default new sttAgent()