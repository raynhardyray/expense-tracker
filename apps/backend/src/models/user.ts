export type UserRaw = {
    id: number;
    user_name: string;
    password: string;
    created_at: string;
};

export interface User {
    id?: number;
    userName: string;
    password: string;
    createdAt?: string | Date;
};

export interface UserDTO {
    id?: number;
    userName?: string;
    createdAt?: string | Date;
};


export const toUserModel = (user: UserRaw): User => {
    return {
        id: user.id,
        userName: user.user_name,
        createdAt: user.created_at,
        password: user.password
    };
};

export const toUserDTO = (user: User): UserDTO => {
    return {
        id: user.id!,
        userName: user.userName!,
        createdAt: user.createdAt!
    };
};