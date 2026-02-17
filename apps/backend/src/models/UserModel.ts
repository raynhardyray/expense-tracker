import { pool } from "@db/database.ts";
import { BaseModel } from "@models/BaseModel.ts";
import { AppError } from "@utils/AppError.ts";
import { hashPassword } from "@utils/PasswordHashing.ts";
import { ErrorCode } from "@shared/constants/errors.ts";
import type { UserRecord } from "@shared/types/user.ts";

class UserModel extends BaseModel {
    constructor() {
        super('users');
    };

    async create(user_name: string, password: string): Promise<UserRecord> {
        try {
            const hashedPass = hashPassword(password);
            
            const query = `INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING id, user_name, created_at`;
            const res = await pool.query(query, [user_name, hashedPass]);

            return res.rows[0];
        } catch (err: any) {
            if (err.code === '23505') {
                throw new AppError('Username is already taken.', ErrorCode.CONFLICT);
            };
            throw err;
        };
    };

    async findByUserId(id: number) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const res = await pool.query(query, [id]);

        if (res.rowCount === 0) {
            throw new AppError('User not found', ErrorCode.NOT_FOUND);
        };

        return res.rows[0] || null;
    };

    // todo
    async patch(user_id: number, field: any) {

    };
};

export const User = new UserModel();