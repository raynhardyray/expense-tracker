import { db } from '#db/database.js';

const resetDatabase = async () => {
    try {
        console.log('Dropping all tables...');
        
        await db.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
            GRANT ALL ON SCHEMA public TO postgres;
            GRANT ALL ON SCHEMA public TO public;
        `);
        
        console.log('Database has been reset');
        process.exit(0);
    } catch (err) {
        console.error('Reset failed:', err);
        process.exit(1);
    }
};

resetDatabase();