const userSeeds = [
    { username: 'admin', password: '12345'}
];

const accountSeeds = [
    { username: 'admin', name: 'Wallet', balance: 1000.00}
];

export const runSeeds = async (db) => {
    console.log('Running seeds...');

    for (const user of userSeeds) {
        const userRes = await db.query(
            `INSERT INTO users (username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING`,
            [user.username, user.password]
        );

        let userId;
        if (userRes.rowCount > 0) {
            userId = userRes.rows[0].id;
        } else {
            const existId = await db.query("SELECT id FROM users WHERE username = $1", [user.username]);
            userId = existId.rows[0].id;
        }
        
        const userAccounts = accountSeeds.filter(a => a.username === user.username);

        for (const acc of userAccounts) {
            await db.query(
                `INSERT INTO accounts (user_id, name, balance)
                SELECT $1, $2, $3
                WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE user_id = $1 AND name = $2)`,
                [userId, acc.name, acc.balance]
            );
        };
    };

    console.log('Seeding finished.');
};