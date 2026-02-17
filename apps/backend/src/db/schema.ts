import type { Pool } from 'pg';

const CREATE_USERS_TABLE = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
`;

const CREATE_ACCOUNTS_TABLE = `
    CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        balance DECIMAL(12, 2) DEFAULT 0.00,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
`;

const tables = [
    CREATE_USERS_TABLE,
    CREATE_ACCOUNTS_TABLE
];

const runTables = async (pool: Pool) => {
    console.log('Creating tables...');

    for (const sql of tables) {
        await pool.query(sql);
    };

    console.log('Tables created.');
};


export const tablesCheck = async (pool: Pool) => {
    const res = await pool.query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
        );`);
    
    const exists = res.rows[0].exists;

    if (!exists) {
        await runTables(pool);
    } else {
        console.log('Tables exists. Skipping...');
    };
};