import express from 'express';
import userRoutes from '@routes/UserRoutes.ts';
import { errorHandler } from '@middleware/errorHandler.ts';
import { databaseInit } from '@db/database.ts';
import { loggingMiddleware } from '@middleware/loggingMiddleware.ts';

const app = express();
const PORT = process.env.port || 3000;

app.use(express.json());

app.use(loggingMiddleware);

app.use('/api/users', userRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await databaseInit();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    };
};

startServer();