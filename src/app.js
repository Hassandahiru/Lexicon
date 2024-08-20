import express, { static as serveStatic } from 'express';
import { resolve, join } from 'path';
import { homeRouter } from './routers/homeRouter.js';
import { db } from './database/localHost.js';

const expressApp = express();
const port = process.env.PORT || 4020;
expressApp.use(express.json());

const __dirname = resolve();
const publicPath = join(__dirname,  'public');
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
});
