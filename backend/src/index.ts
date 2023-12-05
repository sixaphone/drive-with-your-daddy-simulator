import "reflect-metadata"
import express from 'express';
import connection from '@database/connection';
import { Road } from "@simulation/models/road";
import { DEFAULT_LAYOUT } from "@constants";
import { Car } from "@simulation/models/car";
import { Simulation } from "@simulation/models/simulation";

const app = express();

app.get('/', async (_, res) => {
    const road = new Road(DEFAULT_LAYOUT, DEFAULT_LAYOUT.length, DEFAULT_LAYOUT[0].length);
    // two cars at intersection in opposing directions
    const cars = [
        Car.create({ x: 4, y: 2 }, { x: 8, y: 9 }),
        Car.create({ x: 4, y: 5 }, { x: 0, y: 0 }),

    ];

    const simulation = Simulation.create(road, cars);
    console.log(simulation);

    try {
        const response = await simulation.run({ withDelay: false });
        connection.manager.save(simulation);
        res.json(response);
    } catch(e) {
        console.error(e);
        res.send('Error');
    }

})

const port = 3000;

app.listen(port, async () => {
    try {
        await connection.initialize();
        console.log('DB started');
    } catch (e) {
        console.error(e);
    }

    console.log(`Listening on port http://localhost:${port}`);
})