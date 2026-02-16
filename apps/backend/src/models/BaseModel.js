import { db } from '#db/database.js';

export class BaseModel {
    constructor(table) {
        this.table = table;
    };

    async findAll() {
        try {
            const query = `SELECT * FROM ${this.table} ORDER BY created_at DESC`;
            const res = await db.query(query);

            return res.rows;
        } catch (err) {
            console.error(`[Database Error] Error fetching all from ${this.table}:`, err.message);
            throw err;
        };
    };

    async findById(id) {
        try {
            const query = `SELECT * FROM ${this.table} WHERE id = $1`;
            const res = await db.query(query, [id]);

            if (res.rowCount === 0) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            };
            
            return res.rows[0] || null;
        } catch (err) {
            console.error(`[Database Error] Error finding record in ${this.table} by ID:`, err.message);
            throw err;
        };
    };
    
    async delete(id) {
        try {
            const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
            const res = await db.query(query, [id]);

            if (res.rowCount === 0) {
                const error = new Error(`Record with ID ${id} not found in ${this.table}`);
                error.statusCode = 404;
                throw error;
            };

            return res.rows[0];
        } catch (err) {
            console.error(`[Database Error] Error deleting record in ${this.table} by ID:`, err.message);
            throw err;
        };
    };
};