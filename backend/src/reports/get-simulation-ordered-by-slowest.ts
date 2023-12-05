import express from 'express';
import connection from "@database/connection";
import { Simulation } from "@simulation/models/simulation";


export async function getSlowestSimulationsOrderedByTurnsInTraffic(_: express.Request, res: express.Response) {
    const simulations = await connection
        .getRepository(Simulation)
        .createQueryBuilder('simulation')
        .select('simulation.id', 'simulationId')
        .addSelect('simulation.createdAt', 'createdAt')
        .leftJoin('simulation.cars', 'car')
        .groupBy('simulation.id')
        .addSelect('MAX(car.turnsInTraffic)', 'maxTurnsInTraffic')
        .orderBy('maxTurnsInTraffic', 'DESC')
        .getRawMany();

    return res.json(simulations);
}
