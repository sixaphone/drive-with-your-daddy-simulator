import { DataSource } from 'typeorm';
import env from '@env';
import { Simulation } from '@simulation/models/simulation';
import { Road } from '@simulation/models/road';
import { Car } from '@simulation/models/car';
import { ActionLog } from '@simulation/models/action-log';

const connection = new DataSource({
    type: "mysql",
    url: env.DATABASE_URL,
    entities: [Simulation, Road, Car, ActionLog],
    synchronize: env.DATABASE_SYNC,
    logging: env.DATABASE_LOGGING,
});

export default connection;