import { db } from "#db/database.js";
import { BaseModel } from "#models/BaseModel.js";

class UserModel extends BaseModel {
    constructor() {
        super('users');
    };

    async create(user_name, password) {
        try {
            const query = `INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING id, user_name, created_at`;
            const res = await db.query(query, [user_name, password]);

            return res.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                const error = new Error('That user name is already taken.');
                error.statusCode = 409; 
                throw error;
            }
            throw err;
        }

    };
};

export const User = new UserModel();