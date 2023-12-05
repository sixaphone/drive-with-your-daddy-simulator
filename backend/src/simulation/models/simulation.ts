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
    road: Road;

    @OneToMany(() => Car, (car) => car.simulation, { cascade: true })
    cars: Car[];

    aStar: AStar;

    @OneToMany(() => ActionLog, (actionLog) => actionLog.simulation, { cascade: true })
    actionLogs?: ActionLog[];

    constructor(road: Road, cars: Car[]) {
        this.road = road;
        this.aStar = new AStar(road.map);
        this.actionLogs = [];
        this.cars = cars.map((car: Car) => {
            const aStar = this.aStar.findPath(car.start, car.end);
            car.addPath(aStar.path);
            car.addToSimulation(this);

            return car;
        });
    }

    getNextIdForCar(): string {
        return `sim-${AUTO_INCREMENT++}`
    }

    async run() {
        const self = this;

        while (self.cars.length) {

            this.print();

            let carQueue: Car[] = [];
            let toRemoveIds: Set<string> = new Set();
            const length = self.cars.length;

            for (let idx = 0; idx < length; idx++) {
                const car = self.cars[idx];
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
            self.cars = self.cars.filter((car) => !toRemoveIds.has(car.simulationId));
            this.road.updateLights();

            await delay(1000);
        }
    }
    print() {
        for (let x = 0; x < this.road.maxX; x++) {
            let row = '';
            for (let y = 0; y < this.road.maxY; y++) {
                const tile = this.road.map.get(`${x}${y}`);
                row += (tile?.symbol ?? 'X') + ' ';
            }
            console.log(row);
        }

        console.log(NEW_LINE);
        console.log(NEW_LINE);
    }
}
