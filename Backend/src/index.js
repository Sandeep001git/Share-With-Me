import { app } from "./app.js";
import connect from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connect();
        const server = app.listen(process.env.PORT || 8080, () => {
            console.log(`⚙️  Server is running on port ${process.env.PORT || 8080}`);
        });

        // Handle graceful shutdown
        const shutdown = () => {
            server.close(() => {
                console.log('🛑 Server closed');
                process.exit(0);
            });

            setTimeout(() => {
                console.error('Forcefully shutting down');
                process.exit(1);
            }, 10000); // Force shutdown after 10 seconds
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
