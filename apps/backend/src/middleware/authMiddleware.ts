import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from "express";
import { AppError } from '@utils/AppError.ts';
import { ErrorCode } from '@shared/constants/errors.ts';

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };

    if (!token) {
        return next(new AppError('You are not logged in.', ErrorCode.UNAUTHORIZED));
    };

    try {
        const verifyUser = jwt.verify(token, JWT_SECRET!) as { id: number };

        (req as any).user = { id: verifyUser.id };

        next();
    } catch (err: any) {
        return next(new AppError('Invalid or Expired token,', ErrorCode.UNAUTHORIZED));
    }
};