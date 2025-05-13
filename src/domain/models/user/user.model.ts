export type UserId = string;
export type UserIdentityType = "telegram" | "web";

export interface User {
    readonly id: UserId;
    readonly name: string;
    readonly identities: UserIdentityUnion[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface UserIdentity {
    readonly type: UserIdentityType;
    readonly userId: UserId;
}

export interface TelegramIdentity extends UserIdentity {
    readonly type: "telegram";
    readonly telegramId: string;
    readonly username?: string;
}

export interface WebIdentity extends UserIdentity {
    readonly type: "web";
    readonly webId: string;
    readonly email: string;
    readonly verified: boolean;
}

export type UserIdentityUnion = TelegramIdentity | WebIdentity;
