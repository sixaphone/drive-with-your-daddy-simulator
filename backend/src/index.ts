import express from 'express';

const app = express();

app.get('/', (_, res) => {
    res.send('Hello');
})

const port = 3000;

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
})