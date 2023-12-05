import { Neighbours, TileSymbol } from "@types";
import { Car } from "./car";
import { TrafficLight } from "./traffic-light";



export class Tile {
    x: number;
    y: number;
    type: TileSymbol;
    _neighbours: Neighbours<Tile>;
    cars: Car[];
    emergencyCars: Car[];
    trafficLight?: TrafficLight;

    constructor(x: number, y: number, type: TileSymbol) {
        this.x = x;
        this.y = y;
        this.type = type;
        this._neighbours = {};
        this.cars = [];
        this.emergencyCars = [];
    }

    set neighbours(neighbours: Neighbours<Tile>) {
        this._neighbours = neighbours;
    }

    get neighbours(): Readonly<Neighbours<Tile>> {
        return this._neighbours;
    }

    get symbol(): string {
        let carsInSpace = this.emergencyCars.length + this.cars.length;

        if (carsInSpace === 1) {
            return 'C';
        }

        if (carsInSpace > 1) {
            return `${carsInSpace}`;
        }

        return this.type;
    }

    addCar(car: Car) {
        const collection = car.isEmergencyCar ? this.emergencyCars : this.cars;
        collection.push(car);
    }

    addTrafficLight(trafficLight: TrafficLight) {
        this.trafficLight = trafficLight;
    }

    removeCar(car: Car) {
        if (car.isEmergencyCar) {
            this.emergencyCars = this.emergencyCars.filter(c => c.simulationId !== car.simulationId);
            return;
        }

        this.cars = this.cars.filter(c => c.simulationId !== car.simulationId);
    }

    isIntersection() {
        return this.type === 'I';
    }

    isRoundabout() {
        return this.type === 'O';
    }
}
