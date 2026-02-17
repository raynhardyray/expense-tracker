import { pool } from '@db/database.ts';
import { AppError } from '@utils/AppError.ts';
import { ErrorCode } from '@shared/constants/errors.ts';

export class BaseModel {
    constructor(public table: string) {
        this.table = table;
    };

    async findAll() {
        const query = `SELECT * FROM ${this.table} ORDER BY created_at DESC`;
        const res = await pool.query(query);

        return res.rows;
    };

    async findById(id: number) {
        const query = `SELECT * FROM ${this.table} WHERE id = $1`;
        const res = await pool.query(query, [id]);

        if (res.rows.length === 0) {
            throw new AppError("Record not found", ErrorCode.NOT_FOUND);
        };
        
        return res.rows[0] || null;
    };
    
    async delete(id: number) {
        const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
        const res = await pool.query(query, [id]);

        if (res.rows.length === 0) {
            throw new AppError("Record not found", ErrorCode.NOT_FOUND);
        };

        return res.rows[0];
    };
};