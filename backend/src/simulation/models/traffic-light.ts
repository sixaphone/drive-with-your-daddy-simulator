import { TRAFFIC_LIGHT_INTERVAL_TICKS } from "@constants";
import { Direction } from "@types";
import { getRandomNumber } from "@utils/random";

export class TrafficLight {
    startAfter: number;
    timer: number;
    isXGreen: boolean;
    isYGreen: boolean;

    constructor() {
        this.startAfter = getRandomNumber(1, 5);
        this.isXGreen = false;
        this.isYGreen = false;
        this.timer = 0;
    }

    tick() {
        if (this.startAfter > 0) {
            this.startAfter--;

            if (this.startAfter === 0) {
                this.isXGreen = Math.random() > 0.5;
                this.isYGreen = !this.isXGreen;
            }
            return;
        }

        this.timer++;

        if (this.timer % TRAFFIC_LIGHT_INTERVAL_TICKS === 0) {
            this.timer = 1;
            [this.isXGreen, this.isYGreen] = [this.isYGreen, this.isXGreen];
            return;
        }

    }

    isRedLightFor(direction: Direction) {
        switch (direction) {
            case Direction.UP:
            case Direction.DOWN:
                return !this.isYGreen;
            default:
                return !this.isXGreen
        }
    }
}