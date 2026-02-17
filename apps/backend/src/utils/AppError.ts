import { ErrorCode } from '@shared/constants/errors.ts'

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = ErrorCode.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, AppError.prototype);

        Error.captureStackTrace(this, this.constructor);
    };
};