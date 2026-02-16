const userSeeds = [
    { user_name: 'admin', password: '12345'}
];

const accountSeeds = [
    { name: 'Wallet', balance: 1000.00 }
];

export const runSeeds = async (db) => {
    console.log('Running seeds...');

    for (const user of userSeeds) {
        const userRes = await db.query(
            `INSERT INTO users (user_name, password)
            VALUES ($1, $2)
            RETURNING *`,
            [user.user_name, user.password]
        );

        for (const acc of accountSeeds) {
            await db.query(
                `INSERT INTO accounts (user_id, name, balance)
                SELECT $1, $2, $3`,
                [userRes.rows[0].id, acc.name, acc.balance]
            );
        };
    };

    console.log('Seeding finished.');
};