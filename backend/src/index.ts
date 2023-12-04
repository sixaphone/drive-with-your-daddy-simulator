import "reflect-metadata"
import express from 'express';
import connection from './db';

const app = express();

app.get('/', (_, res) => {
    res.send('Hello');
})

const port = 3000;

app.listen(port, async () => {
    try {
        await connection.initialize();
        console.log('DB started');
    } catch(e) {
        console.error(e);
    }
    console.log(`Listening on port http://localhost:${port}`);
})