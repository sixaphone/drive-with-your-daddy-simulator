import { DataSource } from 'typeorm';
import { Simulation } from './models/simulation';

const connection = new DataSource({
    type: "mysql",
    url: process.env.DATABASE_URL,
    entities: [Simulation],
    synchronize: true,
    logging: true,
});

export default connection;