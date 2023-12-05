import { Road } from "./models/road";
import { Car } from "./models/car";
import { DEFAULT_LAYOUT } from "@constants";
import { Simulation } from "./models/simulation";

const road = new Road(DEFAULT_LAYOUT, DEFAULT_LAYOUT.length, DEFAULT_LAYOUT[0].length);

// two cars at intersection in opposing directions
// const cars = [
//     new Car({ x: 4, y: 2 }, { x: 8, y: 9 }),
//     new Car({ x: 4, y: 5 }, { x: 0, y: 0 }),
// ];

// two cars at intersection with right side rule
// const cars = [
//     new Car({ x: 4, y: 2 }, { x: 8, y: 9 }),
//     new Car({ x: 4, y: 4 }, { x: 8, y: 3 }),
// ];

// three cars at intersection with right side rule and one car behind the other
// const cars = [
//     new Car({ x: 4, y: 2 }, { x: 8, y: 9 }),
//     new Car({ x: 4, y: 4 }, { x: 8, y: 3 }),
//     new Car({ x: 4, y: 5 }, { x: 0, y: 0 }),
// ];

// two cars at a roundabout where all can enter
// const cars = [
//     new Car({ x: 4, y: 5 }, { x: 4, y: 11 }),
//     new Car({ x: 4, y: 11 }, { x: 4, y: 5 }),
// ];

// two cars at a roundabout where one has to wait
// const cars = [
//     new Car({ x: 4, y: 5 }, { x: 4, y: 11 }),
//     new Car({ x: 4, y: 11 }, { x: 4, y: 5 }),
//     new Car({ x: 7, y: 8 }, { x: 1, y: 8 }),
//     new Car({ x: 1, y: 8 }, { x: 7, y: 8 }),

//     new Car({ x: 3, y: 6 }, { x: 7, y: 8 }),
//     new Car({ x: 6, y: 7 }, { x: 4, y: 11 }),
//     new Car({ x: 2, y: 9 }, { x: 1, y: 8 }),
//     new Car({ x: 5, y: 10 }, { x: 1, y: 8 }),
// ];

// drive emergency car
// const cars = [
//     new Car({ x: 0, y: 7 }, { x: 8, y: 16 }, true),
// ];

// many cars with emergency ones
const cars = [
    new Car({ x: 0, y: 1 }, { x: 0, y: 0 }),
    new Car({ x: 0, y: 2 }, { x: 8, y: 16 }),
    new Car({ x: 0, y: 3 }, { x: 8, y: 16 }),
    new Car({ x: 0, y: 4 }, { x: 8, y: 16 }),
    new Car({ x: 0, y: 5 }, { x: 8, y: 16 }),
    new Car({ x: 0, y: 6 }, { x: 8, y: 16 }),
    new Car({ x: 0, y: 7 }, { x: 8, y: 16 }, true),
    new Car({ x: 0, y: 8 }, { x: 8, y: 16 }, true),
    new Car({ x: 8, y: 5 }, { x: 0, y: 0 }, true),
];

const simulation = new Simulation(road, cars);
simulation.run().then(() => console.log('DONE')).catch(console.error);

