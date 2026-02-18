import  { toUserDTO } from "@models/user.ts";
import { AppError } from "@utils/AppError.ts";
import { ErrorCode } from "@shared/constants/errors.ts";
import { userRepo } from "@repositories/UserRepository.ts";
import { hashPassword } from "@utils/PasswordHashing.ts";
import  { toUserModel } from "@models/user.ts";
import type { User, UserRaw } from "@models/user.ts";

export const userService = {
    async getAllUsers() {
        const users = await userRepo.findAll();

        return users.map(users => toUserDTO(toUserModel(users)));
    },

    async getUser(userId: number) {
        const user = await userRepo.findById(userId);

        return toUserDTO(toUserModel(user!));
    },

    async createUser (user: User) {
        if (!user.userName?.trim()) {
            throw new AppError('Username is required', ErrorCode.BAD_REQUEST);
        };

        if (!user.password) {
            throw new AppError('Password is empty', ErrorCode.BAD_REQUEST);
        };

        const hashedPass = await hashPassword(user.password);

        const createUser = await userRepo.create({...user, password: hashedPass});

        if (!createUser) {
            throw new AppError('User creation failed', ErrorCode.BAD_REQUEST);
        };

        return toUserDTO(toUserModel(createUser!));
    },

    async deleteUser(userId: number) {
        const user = await userRepo.delete(userId);

        return { 
            status: 'Success',
            message: 'User Deleted',
             ...user
        };
    },

    async updatePassword(user: UserRaw) {
        const hashedPass = await hashPassword(user.password);

        const newPass = await userRepo.updatePassword(toUserModel({
            ...user, 
            password: hashedPass
        }));

        if (!newPass) {
            throw new AppError('Password error', ErrorCode.BAD_REQUEST);
        };

        return toUserDTO(toUserModel(newPass!));
    },

    async findUserById(userId: number): Promise<UserRaw> {
        const user = await userRepo.findById(userId);

        return user!;
    }
};