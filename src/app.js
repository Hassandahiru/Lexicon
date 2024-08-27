import express, { static as serveStatic } from 'express';
import { resolve, join } from 'path';
import { homeRouter } from './routers/homeRouter.js';
import { db } from './database/localHost.js';
import  dotenv  from 'dotenv';
import { startSentenceGenerator } from './utils/Processes/simpleSentenceP.js';

// Assuming .env is in the parent directory
const __dirname = resolve();
const envFilePath = join(__dirname, '.env');
const publicPath = join(__dirname,  'public');

dotenv.config({ path: envFilePath });

const expressApp = express();
const port = process.env.PORT || 4020;
export const gApiKey = process.env.API_KEY;
expressApp.use(express.json());

expressApp.use(serveStatic(publicPath));

expressApp.get('/', (req, res) => {
    res.sendFile(join(publicPath, 'index.html'));
});

expressApp.get('/signin', (req, res) => {
    res.sendFile(join(publicPath, 'index.html'));
});

// router

expressApp.use('/home', homeRouter);


expressApp.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    startSentenceGenerator()

});