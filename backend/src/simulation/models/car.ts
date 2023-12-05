import { Coordinates, Direction } from "@types";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tile } from "./tile";
import { Simulation } from "./simulation";
import { DIRECTION_INVERSION_MAP, PRIORITY_MAP, ROUNDABOUT_NAVIGATION } from "@constants";

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    simulationId!: string;

    @Column({ type: 'json' })
    start!: Coordinates;

    @Column({ type: 'json' })
    end!: Coordinates;

    @Column({ default: false })
    isEmergencyCar!: boolean;

    @Column()
    turnsInTraffic!: number;

    @Column()
    numberOfSteps!: number;

    @ManyToOne(() => Simulation, (simulation) => simulation.cars)
    simulation?: Simulation;

    @Column({ type: 'json', nullable: true })
    route?: { x: number, y: number }[];

    _path!: Tile[];
    _current?: Tile;
    _previous?: Tile;
    _next?: Tile;

    static create(start: Coordinates, end: Coordinates): Car {
        const car = new Car();
        car.start = start;
        car.end = end;
        car._path = [];
        car.turnsInTraffic = 0
        car.simulationId = 'sim';

        return car;
    }

    static createEmergency(start: Coordinates, end: Coordinates): Car {
        const car = Car.create(start, end);
        car.isEmergencyCar = true;

        return car;
    }


    get path(): Tile[] {
        return this._path;
    }

    set path(path) {
        this._path = path;
    }

    set current(tile: Tile | undefined) {
        tile?.addCar(this);
        this._current = tile;
    }

    get current(): Readonly<Tile> | undefined {
        return this._current;
    }

    set next(tile: Tile | undefined) {
        this._next = tile;
    }

    get next(): Readonly<Tile> | undefined {
        return this._next;
    }

    set previous(tile: Tile | undefined) {
        this._previous = tile;
    }

    get previous(): Readonly<Tile> | undefined {
        return this._previous;
    }

    addPath(path: Tile[]): void {
        this.route = path.map((tile) => ({ x: tile.x, y: tile.y }));
        this.numberOfSteps = this.route.length;
        this.previous = undefined;

        const current: Tile | undefined = path.shift();

        if (current) {
            current.addCar(this);
            this._current = current;
        }

        const next: Tile | undefined = path[0];

        if (next) {
            this._next = next;
        }

        this._path = path;
    }

    addToSimulation(simulation: Simulation) {
        this.simulationId = simulation.getNextIdForCar();
        this.simulation = simulation;
    }

    move() {
        this.current?.removeCar(this);
        this._previous = this._current;

        this._current = this._path.shift();
        this.current?.addCar(this);

        this._next = this._path[0];
    }

    incrementTurnsInTraffic() {
        this.turnsInTraffic++;
    }

    hasPriority(other: Car) {
        const direction = this.getDirection();
        const opposingDirection = other.getDirection();

        if (!direction || !opposingDirection) {
            return false;
        }

        if (direction === opposingDirection) {
            const previousTile = this.previous;
            const otherPreviousTile = other.previous;

            if (!previousTile || !otherPreviousTile) {
                return false;
            }

            switch (direction) {
                case 'down':
                case 'left': {
                    return previousTile.x + previousTile.y < otherPreviousTile.x + otherPreviousTile.y;
                }
                case 'up':
                case 'right': {
                    return previousTile.x + previousTile.y > otherPreviousTile.x + otherPreviousTile.y;
                }
            }
        }

        return PRIORITY_MAP[direction] === opposingDirection;
    }

    getDirection(): Direction | undefined {
        const next = this.next;
        const current = this.current;

        if (!current || !next) {
            return;
        }

        if (current.x === next.x) {
            return current.y > next.y ? Direction.LEFT : Direction.RIGHT;
        }

        return current.x > next.x ? Direction.UP : Direction.DOWN;
    }


    getActionLog(): string {
        return `${this.simulationId} @ ${this.current?.x} ${this.current?.y} -> ${this.next?.x} ${this.next?.y}`;
    }

    canMove(): boolean {
        if (!this.next || !this.current) {
            return false;
        }

        if (this.isEmergencyCar) {
            return true;
        }

        const targetTile = this.next;
        const currentTile = this.current;
        const direction = this.getDirection();

        if (!direction) {
            return false;
        }

        if (targetTile.isRoundabout() && !currentTile.isRoundabout()) {
            const next = ROUNDABOUT_NAVIGATION[direction](targetTile);
            const adjecentTile = this.simulation?.road.map.get(`${next.x}${next.y}`);

            if (targetTile.cars.length > 0) {
                return targetTile.cars.every((opposingCar: Car) => !opposingCar.next?.isRoundabout());
            }

            return adjecentTile?.cars.length === 0;
        }

        if (targetTile.isIntersection() && targetTile.trafficLight?.isRedLightFor(direction)) {
            return false;
        }

        if (currentTile?.isIntersection()) {
            const otherCars = currentTile.cars.filter(c => c.simulationId !== this.simulationId);
            const [opposingCar] = otherCars ?? [];

            if (opposingCar && opposingCar.hasPriority(this)) {
                return false;
            }
        }

        if (targetTile.cars.length > 0) {
            return targetTile.cars.every((opposingCar: Car) => {
                const otherCarNextTile = opposingCar.next;

                if (!otherCarNextTile) {
                    return true;;
                }

                const otherCarDirection = opposingCar.getDirection();

                if (direction === otherCarDirection) {
                    return opposingCar.canMove();
                }

                return DIRECTION_INVERSION_MAP[direction] === otherCarDirection
                    ? true
                    : opposingCar.canMove();
            });
        }

        return true;
    }

}

