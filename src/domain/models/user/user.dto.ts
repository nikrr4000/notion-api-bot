export interface UserDTO {
    id: string;
    name: string;
    identities: UserIdentityDTO[];
}

export interface UserIdentityDTO {
    type: "telegram" | "web";
    linkedAt: string;
}

export interface TelegramIdentityDTO extends UserIdentityDTO {
    type: "telegram";
    telegramId: string;
    username?: string;
}

export interface WebIdentityDTO extends UserIdentityDTO {
    type: "web";
    webId: string;
    email: string;
    verified: boolean;
}

export interface LinkIdentityDTO {
    userId: string;
    identity: Omit<TelegramIdentityDTO, "linkedAt"> | Omit<WebIdentityDTO, "linkedAt">;
}

export type UnionIdentityDTO = TelegramIdentityDTO | WebIdentityDTO;
