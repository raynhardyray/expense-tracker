import { Pool, Client } from 'pg';
import { tablesCheck } from '@db/schema.ts';
import { seedsCheck } from '@db/seeds.ts';

const dbConfig = {
    user: process.env.DB_USER,
    password: String(process.env.DB_PASS),
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
};

export const pool = new Pool(dbConfig);

const databaseCheck = async () => {
    const client = new Client({...dbConfig, database: 'postgres'});

    try {
        await client.connect();

        const checkDB = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (checkDB.rowCount === 0) {
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} created.`);
        } else {
            console.log('Database already exists.');
        };
    } catch {

    } finally {
        client.end();
    };
};

export const databaseInit = async () => {
    try {
        await databaseCheck();
        await tablesCheck(pool);
        await seedsCheck(pool);

    } catch (err) {
        console.log(err);
    };
};