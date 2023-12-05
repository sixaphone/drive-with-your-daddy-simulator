import { Direction, type Layout, type Neighbours, type TileSymbol } from "@types";
import { TrafficLight } from "./traffic-light";
import { Column } from "typeorm";
import { Tile } from "./tile";
import { TRAVERSALS } from "@constants";


export class Road {
    @Column({ type: "json" })
    layout: Layout;

    @Column()
    maxX: number;

    @Column()
    maxY: number;

    map: Map<string, any>;

    trafficLigts: TrafficLight[];


    constructor(layout: Layout, maxX: number, maxY: number) {
        this.layout = layout;
        this.maxX = maxX;
        this.maxY = maxY;
        this.trafficLigts = [];
        this.map = new Map();
        this.build();
    }

    build() {
        this.map.set('00', this.createTile(0, 0));
    }

    updateLights() {
        this.trafficLigts.forEach(trafficLight => trafficLight.tick());
    }

    createTile(x: number, y: number) {
        const layout = this.layout;
        const type: TileSymbol | undefined = layout[x]?.[y] as TileSymbol;

        if (!type || type === 'X') {
            return;
        }

        const key = `${x}${y}`;

        if (this.map.has(key)) {
            return this.map.get(key);
        }

        const tile = new Tile(x, y, type);
        this.map.set(key, tile);

        const neighbors: Neighbours<Tile> = {};

        for (let traversal of TRAVERSALS) {
            const next = traversal(x, y);

            const isInMap = this.map.has(next.key);
            const node = isInMap
                ? this.map.get(next.key)
                : this.createTile(next.x, next.y);

            if (node) {
                if (!isInMap) {
                    this.map.set(next.key, node);
                }

                neighbors[next.direction] = node;
            }
        }

        const possibleNeighbours = tile.isRoundabout()
            ? this.getRoundaboutNeighbours(tile, neighbors)
            : neighbors;

        tile.neighbours = possibleNeighbours;

        if (tile.isIntersection()) {
            const trafficLight = new TrafficLight();
            this.trafficLigts.push(trafficLight);
            tile.addTrafficLight(trafficLight);
        }


        return tile;
    }

    getRoundaboutNeighbours(tile: Tile, neighbours: Neighbours<Tile>): Neighbours<Tile> {
        const { rest, road }: { road: Neighbours<Tile>, rest: Neighbours<Tile> } = Object.entries(neighbours)
            .reduce((acc, [direction, neighbour]): { road: Neighbours<Tile>, rest: Neighbours<Tile> } => {
                if (neighbour.type === 'R') {
                    return {
                        rest: acc.rest,
                        road: {
                            ...acc.road,
                            [direction]: neighbour
                        }
                    };
                }

                return {
                    rest: {
                        ...acc.rest,
                        [direction]: neighbour
                    },
                    road: acc.road
                };
            },
                { rest: {}, road: {} }
            );

        const options = [
            [Direction.LEFT, Direction.DOWN],
            [Direction.DOWN, Direction.RIGHT],
            [Direction.RIGHT, Direction.UP],
            [Direction.UP, Direction.LEFT],
        ];

        for (let [target, remove] of options) {
            if (rest[target] && rest[remove]) {
                return {
                    [target]: rest[target],
                    ...road
                }
            }
        }

        const layout = this.layout;

        if (rest[Direction.RIGHT] && rest[Direction.LEFT]) {
            const x = tile.x;
            for (let idx = tile.y + 1; idx < this.maxY; idx++) {
                if (layout[x][idx] === 'O' && layout[x + 1][idx] === 'O') {
                    return {
                        [Direction.LEFT]: rest[Direction.LEFT],
                        ...road
                    }
                }
            }

            return {
                [Direction.RIGHT]: rest[Direction.RIGHT],
                ...road
            }
        }


        if (rest[Direction.UP] && rest[Direction.DOWN]) {
            const y = tile.y;
            for (let idx = tile.x + 1; idx < this.maxX; idx++) {
                if (layout[idx][y] === 'O' && layout[idx][y + 1] === 'O') {
                    return {
                        [Direction.DOWN]: rest[Direction.DOWN],
                        ...road
                    }
                }
            }
        }

        return {
            [Direction.UP]: rest[Direction.UP],
            ...road
        }
    }
}