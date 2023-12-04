import { Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Simulation {
    @PrimaryGeneratedColumn()
    public id!: number
}