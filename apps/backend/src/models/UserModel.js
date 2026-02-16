import { db } from "#db/database.js";
import { BaseModel } from "#models/BaseModel.js";
import bcrypt from 'bcrypt';

class UserModel extends BaseModel {
    constructor() {
        super('users');
    };

    async create(user_name, password) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            const query = `INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING id, user_name, created_at`;
            const res = await db.query(query, [user_name, hashedPassword]);

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

    // todo
    async patch(user_id, field) {

    };
};

export const User = new UserModel();