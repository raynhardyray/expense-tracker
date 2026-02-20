import bcrypt from 'bcrypt';
import { AppError } from '@utils/AppError.ts';
import { ErrorCode } from '@shared/constants/errors.ts';

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
};

export const passwordCheck = async (password: string, passwordHashed: string) => {
    const isMatch = await bcrypt.compare(password, passwordHashed);

    if (!isMatch) {
        throw new AppError('Invalid password', ErrorCode.BAD_REQUEST);
    };

    return isMatch;
};