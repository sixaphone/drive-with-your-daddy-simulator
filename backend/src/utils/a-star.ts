import { Tile } from "@simulation/models/tile";
import { Coordinates } from "@types";

export class AStar {
    map: Map<string, Tile>;

    constructor(map: Map<string, Tile>) {
        this.map = map;
    }
    findPath(start: Coordinates, end: Coordinates): { startTile: Tile | undefined; endTile: Tile | undefined; path: Tile[] } {
        const startTile = this.map.get(`${start.x}${start.y}`);
        const endTile = this.map.get(`${end.x}${end.y}`);

        if (!startTile || !endTile) {
            return {
                startTile,
                endTile,
                path: [],
            };
        }

        const path = this.aStar(startTile, endTile);

        return { startTile, endTile, path };
    }

    aStar(start: Tile, goal: Tile): Tile[] {
        const openSet = new Set<Tile>();
        const cameFrom = new Map<string, Tile>();

        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();

        const calculateHeuristic = (tile: Tile, goal: Tile) => {
            return Math.abs(tile.x - goal.x) + Math.abs(tile.y - goal.y);
        };

        for (const tile of this.map.values()) {
            gScore.set(`${tile.x}${tile.y}`, Infinity);
            fScore.set(`${tile.x}${tile.y}`, Infinity);
        }

        const startKey = `${start.x}${start.y}`;
        gScore.set(startKey, 0);
        fScore.set(startKey, calculateHeuristic(start, goal));
        openSet.add(start);

        while (openSet.size > 0) {
            let current = null;

            for (const tile of openSet) {
                const tileScore = fScore.get(`${tile.x}${tile.y}`) ?? 0;
                const currentScore = fScore.get(`${current?.x}${current?.y}`) ?? 0;
                if (!current || tileScore < currentScore) {
                    current = tile;
                }
            }

            if (current === goal) {
                const path = [];
                let currentTile: Tile | undefined = goal;

                while (currentTile) {
                    path.unshift(currentTile);
                    currentTile = cameFrom.get(`${currentTile.x}${currentTile.y}`);
                }

                return path;
            }

            if (current) {
                openSet.delete(current);

                for (const neighbour of Object.values(current.neighbours ?? {})) {
                    const currentKey = `${current.x}${current.y}`;
                    const neighbourKey = `${neighbour.x}${neighbour.y}`;

                    const tentativeGScore = (gScore.get(currentKey) ?? 0) + 1;
                    const neighbourGScore = gScore.get(neighbourKey) ?? 0;
                    if (tentativeGScore < neighbourGScore) {
                        cameFrom.set(neighbourKey, current);
                        gScore.set(neighbourKey, tentativeGScore);
                        fScore.set(neighbourKey, tentativeGScore + calculateHeuristic(neighbour, goal));
                        openSet.add(neighbour);
                    }
                }
            }

        }

        // No path found
        return [];
    }
}