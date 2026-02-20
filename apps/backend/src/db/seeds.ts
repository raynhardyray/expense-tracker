import type { Pool } from 'pg';
import { hashPassword } from "@utils/PasswordHashing.ts";

const userSeeds = [
    { user_name: 'admin', password: '12345'},
    { user_name: 'raynhard', password: '111111'},
    { user_name: 'juan', password: 'delacruz'}
];

const accountSeeds = [
    { name: 'Wallet', balance: 1000 },
    { name: 'Debit', balance: 5000 },
    { name: 'Credit', balance: 3000}
];

const runSeeds = async (pool: Pool) => {
    console.log('Running seeds...');

    for (const user of userSeeds) {
        const hashedPass = await hashPassword(user.password);

        const userRes = await pool.query(
            `INSERT INTO public.users (user_name, password)
            VALUES ($1, $2)
            RETURNING *`,
            [user.user_name, hashedPass]
        );

        const userId = userRes.rows[0].id;

        for (const acc of accountSeeds) {
            await pool.query(
                `INSERT INTO accounts (user_id, name, balance)
                VALUES ($1, $2, $3)`,
                [userId, acc.name, acc.balance]
            );
        };
    };

    console.log('Seeding finished.');
};

export const seedsCheck = async (pool: Pool) => {
    const res = await pool.query(`SELECT COUNT(*) FROM users`);
    const count = parseInt(res.rows[0].count);

    if (count === 0) {
        await runSeeds(pool);
    } else {
        console.log('Record exists. Skipping...');
    };
};