import type {Request, Response } from "express";
import { userService } from "@services/userService.ts";
import { asyncHandler } from "@middleware/asyncHandler.ts";

class UserController {
    getAllusers = asyncHandler(async (req: Request, res: Response) => {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    });

    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.getUser(Number(req.params.id));
        console.log(user);

        res.status(200).json(user);
    });

    loginUser = asyncHandler(async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const loggedInUser = await userService.loginUser({
            userName: username,
            password: password
        });

        res.status(200).json(loggedInUser);
    });

    registerUser = asyncHandler(async (req: Request, res: Response) => {
        const { user_name, password } = req.body;

        const newUser = await userService.createUser({
            userName: user_name,
            password: password,
        });

        res.status(201).json(newUser);
    });

    updateUserPassword = asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.findUserById(Number(req.params.id));
        const { password } = req.body;

        const userWithPass = await userService.updatePassword({
            ...user,
            password: password
        });

        res.status(200).json(userWithPass);
    });

    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.deleteUser(Number(req.params.id));

        res.status(200).json(user);
    });
};

export const userController = new UserController();