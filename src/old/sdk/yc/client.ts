import sanitizedConfig from "#root/old/config.js";
// import jose from 'node-jose';
import { Session } from "@yandex-cloud/nodejs-sdk";

// const {
//     iam: {
//         iam_token_service: {
//             CreateIamTokenRequest,
//         }
//     },
// } = cloudApi;

const {
    YC_AUTH_KEY_ID: accessKeyId,
    YC_AUTH_SERVICE_ACCOUNT_ID: serviceAccountId,
    YC_AUTH_PRIVATE_KEY: privateKey,
    YC_FOLDER_ID: folderId,
} = sanitizedConfig;

class YCClientAgent {
    private accessKeyId: string;
    private serviceAccountId: string;
    private privateKey: string;
    // private token: string | null
    // private lastTokenUpdate: number | null
    private folderId: string;
    private session: Session;

    constructor() {
        this.accessKeyId = accessKeyId;
        this.serviceAccountId = serviceAccountId;
        this.privateKey = privateKey;
        // this.token = null
        // this.lastTokenUpdate = null
        this.folderId = folderId;
        this.session = this.initializeClient();
    }

    // private createJWT() {
    //     const now = Math.floor(new Date().getTime() / 1000);

    //     const payload = {
    //         iss: this.serviceAccountId,
    //         iat: now,
    //         exp: now + 3600,
    //         aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens"
    //     };

    //     return jose.JWK.asKey(this.privateKey, 'pem', { kid: this.accessKeyId, alg: 'PS256' })
    //         .then((result) => jose.JWS.createSign({ format: 'compact' }, result)
    //             .update(JSON.stringify(payload))
    //             .final());
    // }

    private initializeClient() {
        return new Session({
            serviceAccountJson: {
                accessKeyId: this.accessKeyId,
                serviceAccountId: this.serviceAccountId,
                privateKey: this.privateKey,
            },
        });
    }

    // private async createIamToken() {
    //     const tokenClient = this.session.client(serviceClients.IamTokenServiceClient)
    //     const jwt = await this.createJWT()
    //     const tokenRequest = CreateIamTokenRequest.fromPartial({ jwt: jwt.toString() })
    //     const { iamToken } = await tokenClient.create(tokenRequest)
    //     return iamToken
    // }

    // private shouldUpdateToken() {
    //     if (!this.lastTokenUpdate) return true
    //     const diffInMilliseconds = new Date().getTime() - this.lastTokenUpdate
    //     const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    //     return diffInHours >= 24
    // }

    // private async updateIamToken() {
    //     try
    //     {
    //         this.lastTokenUpdate = new Date().getTime()
    //         this.token = await this.createIamToken()
    //         console.debug(`IAM token updated successfully at ${new Date().toISOString()}`)
    //     } catch (error)
    //     {
    //         console.error('Failed to update IAM token:', error)
    //         throw error
    //     }
    // }

    // private getToken() { return this.token }

    public getSession() {
        return this.session;
    }

    public getFolderId() {
        return this.folderId;
    }

    // public async invokeWithIam(cb: <T>(cbToken: string, cbArgs?: string[]) => T, args: string[]) {
    //     try
    //     {
    //         if (this.shouldUpdateToken())
    //         {
    //             await this.updateIamToken()
    //         }

    //         const token = this.getToken()
    //         if (!token) throw new Error("unauthorized")
    //         return await cb(token, args)
    //     } catch (e)
    //     {
    //         const err = e as Error
    //         if (err.message.includes('unauthorized') || err.message.includes('token expired'))
    //         {
    //             await this.updateIamToken()
    //             const token = this.getToken()
    //             if (!token) throw new Error("Token is null after refresh attempt")
    //             return await cb(token, args)
    //         }
    //         throw new Error(err.message)
    //     }
    // }
}

export default new YCClientAgent();
