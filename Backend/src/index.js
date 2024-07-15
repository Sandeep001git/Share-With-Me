import { app } from './app.js';
import connect from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connect();
        app.listen(process.env.PORT || 3000 , ()=>{
            console.log('⚙️  Server is ready');
        })
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

export default app; // Export the app for Vercel
