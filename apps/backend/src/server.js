import express from 'express';
import {db} from '#db/database.js';
import userRoutes from '#routes/UserRoutes.js';
import { errorHandler } from '#middleware/errorHandler.js';

const app = express();
const PORT = process.env.port || 3000;
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await db.init();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    };
};

startServer();