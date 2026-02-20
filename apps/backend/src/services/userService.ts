import jwt from 'jsonwebtoken';
import  { toUserDTO } from "@models/user.ts";
import { AppError } from "@utils/AppError.ts";
import { ErrorCode } from "@shared/constants/errors.ts";
import { userRepo } from "@repositories/UserRepository.ts";
import { hashPassword, passwordCheck } from "@utils/PasswordHashing.ts";
import  { toUserModel } from "@models/user.ts";
import type { User, UserDTO, UserRaw } from "@models/user.ts";

export const userService = {
    async getAllUsers(): Promise<UserDTO[]> {
        const users = await userRepo.findAll();

        const userDTO = users.map(users => toUserDTO(toUserModel(users)));

        return userDTO;
    },

    async getUser(userId: number): Promise<UserDTO> {
        const user = await userRepo.findById(userId);

        const userDTO = toUserDTO(toUserModel(user!))

        return userDTO;
    },

    async createUser (user: User): Promise<UserDTO> {
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

        const userDTO = toUserDTO(toUserModel(createUser!));

        return userDTO;
    },

    async deleteUser(userId: number) {
        const user = await userRepo.delete(userId);

        return { 
            status: 'Success',
            message: 'User Deleted',
             ...user
        };
    },

    async updatePassword(user: UserRaw): Promise<UserDTO> {
        const hashedPass = await hashPassword(user.password);

        const newPass = await userRepo.updatePassword(toUserModel({
            ...user, 
            password: hashedPass
        }));

        if (!newPass) {
            throw new AppError('Password error', ErrorCode.BAD_REQUEST);
        };

        const userDTO = toUserDTO(toUserModel(newPass!));

        return userDTO;
    },

    async findUserById(userId: number): Promise<UserRaw> {
        const user = await userRepo.findById(userId);

        return user!;
    },

    async loginUser(user: User) {
        const username = await userRepo.findByUsername(user.userName);

        if (!username) {
            throw new AppError('Username doesnt exist', ErrorCode.NOT_FOUND);
        };

        await passwordCheck(user.password, username!.password);

        const token = jwt.sign({
            id: username.id,
            username: username!.user_name}, 
            process.env.JWT_SECRET!, 
            { expiresIn: '1h'})

        return token;
    },
};