import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { AStar } from "@utils/a-star";
import { delay } from "@utils/time";
import { Road } from "./road";
import { Car } from "./car";
import { ActionLog } from "./action-log";

let AUTO_INCREMENT = 1;

const NEW_LINE = '\r\n';

@Entity()
export class Simulation {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column(() => Road)
    road!: Road;

    @OneToMany(() => Car, (car) => car.simulation, { cascade: true })
    cars!: Car[];

    @OneToMany(() => ActionLog, (actionLog) => actionLog.simulation, { cascade: true })
    actionLogs?: ActionLog[];

    aStar!: AStar;

    static create(road: Road, cars: Car[]): Simulation {
        const simulation = new Simulation();
        simulation.road = road;
        simulation.aStar = new AStar(road?.map);
        simulation.actionLogs = [];
        simulation.cars = cars.map((car: Car) => {
            const aStar = simulation.aStar.findPath(car.start, car.end);
            car.addPath(aStar.path);
            car.addToSimulation(simulation);

            return car;
        });

        return simulation;
    }

    getNextIdForCar(): string {
        return `sim-${AUTO_INCREMENT++}`
    }

    async run({ withDelay = true } = {}) {
        const self = this;
        const layouts = [];

        let cars = [...self.cars];

        while (cars.length) {
            layouts.push(this.print());

            let carQueue: Car[] = [];
            let toRemoveIds: Set<string> = new Set();
            const length = cars.length;

            for (let idx = 0; idx < length; idx++) {
                const car = cars[idx];
                if (car.next) {
                    if (car.canMove()) {
                        carQueue.push(car);
                        this.actionLogs?.push(new ActionLog(car.getActionLog(), self));
                    }
                    car.incrementTurnsInTraffic();
                } else {
                    car.current?.removeCar(car);
                    toRemoveIds.add(car.simulationId);
                }
            }

            carQueue.forEach(car => car.move());
            cars = cars.filter((car) => !toRemoveIds.has(car.simulationId));
            this.road.updateLights();

            if (withDelay) {
                await delay(1000);
            }
        }

        return layouts;
    }
    print() {
        const layout = [];

        for (let x = 0; x < this.road.maxX; x++) {
            let toPrint = '';
            let row = [];
            for (let y = 0; y < this.road.maxY; y++) {
                const tile = this.road.map.get(`${x}${y}`);
                const symbol = (tile?.symbol ?? 'X');
                toPrint += `${symbol} `;
                row.push(symbol);
            }
            console.log(toPrint);
            layout.push(row);
        }

        console.log(NEW_LINE);
        console.log(NEW_LINE);

        return layout;
    }
}
