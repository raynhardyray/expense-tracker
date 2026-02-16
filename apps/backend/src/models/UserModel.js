import { db } from "#db/database.js";
import { BaseModel } from "#models/BaseModel.js";

class UserModel extends BaseModel {
    constructor() {
        super('users');
    };

    async create(username, password) {
        try {
            const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at`;
            const res = await db.query(query, [username, password]);

            return res.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                const error = new Error('That username is already taken.');
                error.statusCode = 409; 
                throw error;
            }
            throw err;
        }

    };
};

export const User = new UserModel();