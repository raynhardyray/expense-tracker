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
        res.json(user);
    });

    registerUser = asyncHandler(async (req: Request, res: Response) => {
        const { user_name, password } = req.body;

        const newUser = await userService.createUser({
            userName: user_name,
            password: password,
        });

        res.status(201).json(newUser);
    });

    // TODO: update user

    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.deleteUser(Number(req.params.id));

        res.status(200).json(user);
    });
};

export const userController = new UserController();