export enum Direction {
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    LEFT = 'left',
}

export interface Coordinates {
    x: number;
    y: number
}

export type TileSymbol = 'R' | 'O' | 'I' | 'X';

export type Layout = Array<Array<string>>;

export interface TraversalResult {
    direction: Direction;
    key: string;
    x: number;
    y: number;
}

export type Traversal = (x: number, y: number) => TraversalResult;

export interface Neighbours<T> {
    [Direction.LEFT]?: T;
    [Direction.RIGHT]?: T;
    [Direction.UP]?: T;
    [Direction.DOWN]?: T;
}

