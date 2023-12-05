import "reflect-metadata"
import express from 'express';
import connection from '@database/connection';
import cors from 'cors';
import { Road } from "@simulation/models/road";
import { DEFAULT_LAYOUT } from "@constants";
import { Car } from "@simulation/models/car";
import { Simulation } from "@simulation/models/simulation";
import env from "@env";
import type { CarInput, RunSimulationInput } from "@types";

const app = express();

app.use(cors());

app.use(express.json());

app.post('/simulate', async (req, res) => {
    const body = req.body as RunSimulationInput;
    const road = new Road(DEFAULT_LAYOUT, DEFAULT_LAYOUT.length, DEFAULT_LAYOUT[0].length);

    const cars = body.cars.map(
        (car: CarInput) => car.isEmergency 
            ? Car.createEmergency(car.start, car.end) 
            : Car.create(car.start, car.end)
    );

    if (cars.length === 0) {
        return res.json({
            message: 'Unable to run without cars'
        });
    }

    const simulation = Simulation.create(road, cars);

    try {
        const response = await simulation.run({ print: false, withDelay: false });
        connection.manager.save(simulation);
        res.json(response);
    } catch(e) {
        res.status(400).json({
            code: 400,
            error: e
        });
    }

    return;
})

const port = env.PORT;

app.listen(port, async () => {
    try {
        await connection.initialize();
        console.log('DB started');
    } catch (e) {
        console.error(e);
    }

    console.log(`Listening on port http://localhost:${port}`);
})