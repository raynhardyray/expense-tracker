import pg from 'pg';
import {tables} from '#db/schema.js';
import {runSeeds} from '#db/seeds.js';

const { Pool, Client } = pg;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
};

const pool = new Pool(dbConfig);


const checkDatabase = async () => {
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
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.end();
    }
};

export const db = {
    query: (text, params) => pool.query(text, params),

    async init() {
        try {
            await checkDatabase();

            console.log('Creating tables...');
            for (const sql of tables) {
                await pool.query(sql);
            };
            console.log('Tables finished');
            
            await runSeeds(this);

            console.log('Database, Schema, and Seeds are ready');
        } catch (err) {
            console.error('Initialization failed: ', err);
            throw err;
        };
    }
};