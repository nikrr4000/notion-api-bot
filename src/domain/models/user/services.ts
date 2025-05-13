import { User, UserIdentityUnion } from "./user.model.js";
import { UserDTO, UnionIdentityDTO } from "./user.dto.js";

const toDTO = (user: User): UserDTO => {
    return {
        id: user.id,
        name: user.name,
        identities: user.identities.map((identity) => identityToDTO(identity)),
    };
};

const identityToDTO = (identity: UserIdentityUnion): UnionIdentityDTO => {
    if (identity.type === "telegram") {
        return {
            type: identity.type,
            telegramId: identity.telegramId,
            username: identity.username,
            linkedAt: identity.linkedAt.toISOString(),
        };
    } else {
        return {
            type: identity.type,
            webId: identity.webId,
            email: identity.email,
            verified: identity.verified,
            linkedAt: identity.linkedAt.toISOString(),
        };
    }
};

const linkIdentity = (user: User, identity: Omit<UserIdentityUnion, "userId" | "linkedAt">): User => {
    const newIdentity = {
        ...identity,
        userId: user.id,
        linkedAt: new Date(),
    } as UserIdentityUnion;

    return {
        ...user,
        identities: [...user.identities, newIdentity],
        updatedAt: new Date(),
    };
};

export const user = {
    toDTO,
    identityToDTO,
    linkIdentity,
};
