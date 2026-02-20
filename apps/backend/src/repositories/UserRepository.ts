import { BaseRepository } from "@/src/repositories/BaseRepository.ts";
import { AppError } from "@utils/AppError.ts";
import { ErrorCode } from "@shared/constants/errors.ts";
import type { User, UserRaw } from "@models/user.ts";

class UserRepository extends BaseRepository<UserRaw> {
    constructor() {
        super('users');
    };

    async create(user: User): Promise<UserRaw | undefined> {
        try {
            const sql = `
                INSERT INTO users (user_name, password) 
                VALUES ($1, $2) 
                RETURNING id, user_name, created_at`;

            const res = await this.query(sql, [user.userName, user.password]);

            return res.rows[0];
        } catch (err: any) {
            if (err.code === '23505') {
                throw new AppError('Username is already taken.', ErrorCode.CONFLICT);
            };
            throw err;
        };
    };

    async findByUsername(userName: string): Promise<UserRaw | undefined> {
        const sql = `
            SELECT *
            FROM users
            WHERE user_name = $1
            LIMIT 1`;
        
        const res = await this.query(sql, [userName]);

        return res.rows[0];
    };
    
    async removeUser(userId: number): Promise<UserRaw | undefined> {
        return this.delete(userId);
    };

    async updatePassword(user: User): Promise<UserRaw | undefined> {
        const sql = `
            UPDATE users
            SET password = $1
            WHERE id = $2
            RETURNING *`;
        
        const res = await this.query(sql, [user.password, user.id]);

        return res.rows[0];
    };
};

export const userRepo = new UserRepository();