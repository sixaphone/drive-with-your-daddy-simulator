import express from 'express';
import connection from "@database/connection";
import { Simulation } from "@simulation/models/simulation";
import { FilterSimulationsInput } from '@types';

export async function getSimulations(req: express.Request, res: express.Response): Promise<void> {
    const { from, to } = req.query as unknown as FilterSimulationsInput;

    let query = connection
        .getRepository(Simulation)
        .createQueryBuilder('simulation')
        .select([
            'simulation.id', 
            'simulation.createdAt', 
            'cars.start', 
            'cars.end', 
            'cars.simulationId',
            'cars.isEmergencyCar',
            'cars.turnsInTraffic', 
            'cars.numberOfSteps',
            'cars.route'
        ])
        .leftJoin('simulation.cars', 'cars')
        .orderBy('simulation.createdAt', 'DESC');

    if (from) {
        query = query.andWhere('simulation.createdAt >= :from', { from: new Date(from) });
    }

    if (to) {
        query = query.andWhere('simulation.createdAt >= :from', { from: new Date(to) });
    }

    const simulations = await query.getMany();


    res.json({
        simulations,
        total: simulations.length
    });
}