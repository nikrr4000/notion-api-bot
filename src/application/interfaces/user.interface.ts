import { UserIdentityUnion, User, UserId } from "#root/domain/models/user/user.model.js";

export interface UserService {
    createUser(identity: UserIdentityUnion): Promise<User>;
    findUser(id: UserId): Promise<User | null>;
}
