import { AppError } from "@utils/AppError.ts";
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err);


    const statusCode = err instanceof AppError ? err.statusCode : 500;

    const isOperational = statusCode >=400 && statusCode < 500;

    let prodErrorObject = {
        success: false,
        message: isOperational ? err.message : "Internal Server Error",
    };

    let devErrorObject = {
        success: false,
        message: err.message || "Something went wrong",
        statusCode,
        url: req.originalUrl,
        body: req.body,
        cause: err.cause ?? err.stack,
    };

    res.status(statusCode);

    if (process.env.NODE_ENV === "development") {
        return res.json(devErrorObject);
    } else {
        return res.json(prodErrorObject);
    };
};