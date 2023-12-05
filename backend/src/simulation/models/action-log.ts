import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Simulation } from "./simulation";



@Entity()
export class ActionLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    log!: string;

    @ManyToOne(() => Simulation, simulation => simulation.actionLogs)
    simulation?: Simulation;

    constructor(log: string, simulation: Simulation) {
        this.log = log;
        this.simulation = simulation;
    }
}
