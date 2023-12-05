import express from 'express';
import connection from "@database/connection";
import { Simulation } from "@simulation/models/simulation";
import { Car } from '@simulation/models/car';

export async function getSimulation(req: express.Request, res: express.Response) {
    const id: number | undefined = +req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: '400',
            message: 'Missing or invalid ID'
        })
    }
    let query = connection
        .getRepository(Simulation)
        .createQueryBuilder('simulation')
        .where('simulation.id = :id', { id })
        .select([
            'simulation.id',
            'simulation.createdAt',
            'cars.start',
            'cars.end',
            'cars.simulationId',
            'cars.isEmergencyCar',
            'cars.turnsInTraffic',
            'cars.numberOfSteps',
            'cars.route',
            'actionLogs.log'
        ])
        .leftJoin('simulation.cars', 'cars')
        .leftJoin('simulation.actionLogs', 'actionLogs');

    const simulations = await query.getOne();

    if (!simulations) {
        return res.status(404).json({
            code: '404',
            message: 'Simulation not found'
        })
    }

    const sortedCars = simulations.cars
        .sort((a, b) => a.turnsInTraffic - b.turnsInTraffic)
        .map((c: Car) => ({
            ...c,
            additionalTurnsTaken: c.turnsInTraffic - c.numberOfSteps
        }));


    return res.json({
        simulationId: simulations.id,
        createdAt: simulations.createdAt,
        sortedCars: sortedCars,
        fastestCar: sortedCars[0],
        slowestCar: sortedCars[sortedCars.length - 1],
        noOfCars: sortedCars.length,
        noOfEmergencyCars: sortedCars.filter((c) => c.isEmergencyCar).length,
        noOfNormalCars: sortedCars.filter((c) => !c.isEmergencyCar).length,
        noOfActions: simulations.actionLogs?.length,
        actionLogs: simulations.actionLogs
    });
}