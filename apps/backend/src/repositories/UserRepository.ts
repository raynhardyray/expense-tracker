import { BaseRepository } from "@/src/repositories/BaseRepository.ts";
import { AppError } from "@utils/AppError.ts";
import { ErrorCode } from "@shared/constants/errors.ts";
import type { User, UserRaw } from "@models/user.ts";

class UserRepository extends BaseRepository<UserRaw> {
    constructor() {
        super('users');
    };

    async create(user: User): Promise<UserRaw | null> {
        try {
            const sql = `
                INSERT INTO users (user_name, password) 
                VALUES ($1, $2) 
                RETURNING id, user_name, created_at`;

            const res = await this.query(sql, [user.userName, user.password]);

            return res.rows[0] || null;
        } catch (err: any) {
            if (err.code === '23505') {
                throw new AppError('Username is already taken.', ErrorCode.CONFLICT);
            };
            throw err;
        };
    };
    
    async removeUser(userId: number): Promise<UserRaw | undefined> {
        return this.delete(userId);
    };
};

export const userRepo = new UserRepository();