import { AppError } from '@utils/AppError.ts';
import { ErrorCode } from '@shared/constants/errors.ts';
import { Pool } from 'pg';
import { dbConfig } from '@db/database.ts';
import type { QueryResult } from 'pg';

export class BaseRepository<T extends Record<string, any>> {
    protected readonly pool: Pool;

    constructor(public readonly table: string) {
        this.pool = new Pool(dbConfig);
    };

    protected async query<R extends T = T>(
        sql: string,
        params: unknown[] = []
        ): Promise<QueryResult<R>> {
        return this.pool.query<R>(sql, params);
    };

    async findAll(): Promise<T[]> {
        const sql = `
            SELECT *
            FROM ${this.table} 
            ORDER BY created_at DESC`;
        const res = await this.query<T>(sql);

        return res.rows;
    };

    async findById(id: number): Promise<T | undefined> {
        const sql = `SELECT * FROM ${this.table} WHERE id = $1`;
        const res = await this.query<T>(sql, [id]);

        if (res.rows.length === 0) {
            throw new AppError("Record not found", ErrorCode.NOT_FOUND);
        };
        
        return res.rows[0];
    };
    
    async delete(id: number): Promise<T | undefined> {
        const sql = `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`;
        const res = await this.query<T>(sql, [id]);

        if (res.rows.length === 0) {
            throw new AppError("Record not found", ErrorCode.NOT_FOUND);
        };

        return res.rows[0];
    };
};