import { Tile } from "@simulation/models/tile";
import { Coordinates, Direction, type Layout, type Traversal } from "@types";

export const TRAFFIC_LIGHT_INTERVAL_TICKS = 5;

export const DEFAULT_LAYOUT: Layout = [
    //0    1    2    3    4    5    6    7    8    9   10   11   12   13    14  15   16
    ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",],
    ["R", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "O", "O", "O", "O", "O", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "O", "X", "X", "X", "O", "X", "X", "R", "X", "X", "R"],
    ["I", "R", "R", "I", "R", "R", "O", "X", "X", "X", "O", "R", "R", "I", "R", "R", "I"],
    ["R", "X", "X", "R", "X", "X", "O", "X", "X", "X", "O", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "O", "O", "O", "O", "O", "X", "X", "R", "X", "X", "R"],
    ["R", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "R"],
    ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",],
];

export const TRAVERSALS: Traversal[] = [
    (x, y) => ({ direction: Direction.LEFT, x, y: y - 1, key: `${x}${y - 1}` }),
    (x, y) => ({ direction: Direction.RIGHT, x, y: y + 1, key: `${x}${y + 1}` }),
    (x, y) => ({ direction: Direction.DOWN, x: x + 1, y, key: `${x + 1}${y}` }),
    (x, y) => ({ direction: Direction.UP, x: x - 1, y, key: `${x - 1}${y}` }),
];

export const PRIORITY_MAP: Record<Direction, Direction> = {
    [Direction.RIGHT]: Direction.DOWN,
    [Direction.LEFT]: Direction.UP,
    [Direction.UP]: Direction.RIGHT,
    [Direction.DOWN]: Direction.LEFT,
};


export const DIRECTION_INVERSION_MAP: Record<Direction, Direction> = {
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
}

export const ROUNDABOUT_NAVIGATION: Record<Direction, (tile: Tile) => Coordinates> = {
    [Direction.LEFT]: ({ x, y }) => ({ x: x + 1, y }),
    [Direction.RIGHT]: ({ x, y }) => ({ x: x - 1, y }),
    [Direction.DOWN]: ({ x, y }) => ({ x, y: y + 1 }),
    [Direction.UP]: ({ x, y }) => ({ x, y: y - 1 }),

};