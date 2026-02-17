import type { Pool } from "pg";
import { pool } from "@db/database.ts"
import { tablesCheck } from "@db/schema.ts";
import { seedsCheck } from "@db/seeds.ts";

const resetDatabase = async (pool: Pool) => {
    try {
        await pool.connect();

        console.log('Dropping all tables...');
        
        await pool.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
            GRANT ALL ON SCHEMA public TO postgres;
            GRANT ALL ON SCHEMA public TO public;
        `);

        await tablesCheck(pool);
        await seedsCheck(pool);

        process.exit(0);
    } catch (err) {
        console.error('Reset failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    };
};

resetDatabase(pool);