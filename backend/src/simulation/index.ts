// const LAYOUT = [
//     ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",],
//     ["R", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "R"],
//     ["R", "X", "X", "R", "X", "X", "O", "O", "O", "O", "O", "X", "X", "R", "X", "X", "R"],
//     ["R", "X", "X", "R", "X", "X", "O", "X", "X", "X", "O", "X", "X", "R", "X", "X", "R"],
//     ["I", "R", "R", "I", "R", "R", "O", "X", "X", "X", "O", "R", "R", "I", "R", "R", "I"],
//     ["R", "X", "X", "R", "X", "X", "O", "X", "X", "X", "O", "X", "X", "R", "X", "X", "R"],
//     ["R", "X", "X", "R", "X", "X", "O", "O", "O", "O", "O", "X", "X", "R", "X", "X", "R"],
//     ["R", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "X", "X", "R", "X", "X", "R"],
//     ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R",],
// ];

// const TRAVERSALS = [
//     (x, y) => ({ dir: 'left', x, y: y - 1, key: `${x}${y - 1}` }),
//     (x, y) => ({ dir: 'right', x, y: y + 1, key: `${x}${y + 1}` }),
//     (x, y) => ({ dir: 'down', x: x + 1, y, key: `${x + 1}${y}` }),
//     (x, y) => ({ dir: 'up', x: x - 1, y, key: `${x - 1}${y}` }),
// ];

// const TRAFFIC_LIGHT_INTERVAL_TICKS = 5;

// const ROUNDABOUT_NAVIGATION = {
//     left: ({ x, y }) => ({ x: x + 1, y }),
//     right: ({ x, y }) => ({ x: x - 1, y }),
//     down: ({ x, y }) => ({ x, y: y + 1 }),
//     up: ([x, y]) => ({ x, y: y - 1 }),
// };

// const TILE_MAP = {
//     'R': 'R ',
//     'I': 'I ',
//     'X': 'X ',
//     'O': 'O ',
// };

// const INTERSECTION_MAP = {
//     'left': {
//         front: 'left',
//     }
// }

// const PRIORITY_MAP = {
//     right: 'down',
//     left: 'up',
//     up: 'right',
//     down: 'left',
// };


// const DIRECTION_INVERSION_MAP = {
//     left: 'right',
//     right: 'left',
//     up: 'down',
//     down: 'up',
// }

// let CAR_ID = 1;

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// class PriorityQueue {
//     constructor() {
//         this.nodes = [];
//     }

//     enqueue(node, priority) {
//         this.nodes.push({ node, priority });
//         this.sort();
//     }

//     dequeue() {
//         return this.nodes.shift().node;
//     }

//     sort() {
//         this.nodes.sort((a, b) => a.priority - b.priority);
//     }

//     isEmpty() {
//         return !this.nodes.length;
//     }
// }

// class TrafficLight {
//     constructor() {
//         this.startAfter = Math.floor(Math.random() * 6) + 1; // Generates a random integer from 1 to 6
//         this.isXGreen = false;
//         this.isYGreen = false;
//         this.timer = 0;
//     }

//     tick() {
//         if (this.startAfter > 0) {
//             this.startAfter--;

//             if (this.startAfter === 0) {
//                 this.isXGreen = Math.random() > 0.5;
//                 this.isYGreen = !this.isXGreen;
//             }
//             return;
//         }

//         this.timer++;

//         if (this.timer % TRAFFIC_LIGHT_INTERVAL_TICKS === 0) {
//             this.timer = 1;
//             [this.isXGreen, this.isYGreen] = [this.isYGreen, this.isXGreen];
//             return;
//         }

//     }

//     isRedLightFor(direction) {
//         switch (direction) {
//             case 'up':
//             case 'down':
//                 return !this.isYGreen;
//             default:
//                 return !this.isXGreen
//         }
//     }
// }

// class Car {
//     constructor(start, end, isEmergencyCar) {
//         this.id = CAR_ID++;
//         this.start = start;
//         this.end = end;
//         this.isEmergencyCar = isEmergencyCar;
//         this._path = [];
//         this.visited = [];
//     }

//     set path(path) {
//         this._path = path;
//     }

//     get path() {
//         return this._path;
//     }

//     getNextMove() {
//         return this.getMove(1);
//     }

//     getMove(move) {
//         return this._path.length ? this._path[move - 1] : null;
//     }

//     hasNextMove() {
//         return !!this._path.length;
//     }

//     move(tile) {
//         this.tile = tile;
//         this.visited.push(tile);
//         return this._path.shift();
//     }

//     hasPriority(other, direction) {
//         const nextDirection = this.getDirection();
//         const otherNextDirection = other.getDirection();

//         if (nextDirection !== otherNextDirection) {
//             const previousTile = this.visited[this.visited.length - 2];
//             const otherPreviousTile = other.visited[this.visited.length - 2];

//             switch (direction) {
//                 case 'down':
//                 case 'left': {
//                     return previousTile.x + previousTile.y < otherPreviousTile.x + otherPreviousTile.y;
//                 }
//                 case 'up':
//                 case 'right': {
//                     return previousTile.x + previousTile.y > otherPreviousTile.x + otherPreviousTile.y;
//                 }
//             }
//         }

//         return PRIORITY_MAP[nextDirection] === otherNextDirection;
//     }

//     getDirection() {
//         const nextTile = this.getNextMove();

//         if (!this.tile || !nextTile) {
//             return;
//         }

//         if (this.tile.x === nextTile.x) {
//             return this.tile.y > nextTile.y ? 'left' : 'right';
//         }

//         return this.tile.x > nextTile.x ? 'up' : 'down';
//     }

// }


// class Tile {
//     constructor(x, y, type) {
//         this.x = x;
//         this.y = y;
//         this.type = type;
//         this.neighbours = {};
//         this.cars = [];
//         this.emergencyCars = [];
//     }

//     setNeighbours(neightbours) {
//         this.neighbours = neightbours;

//         return this;
//     }

//     symbol() {
//         let carsInSpace = this.emergencyCars.length + this.cars.length;

//         if (carsInSpace === 1) {
//             return 'C ';
//         }

//         if (carsInSpace > 1) {
//             return `${carsInSpace} `;
//         }

//         return TILE_MAP[this.type];
//     }

//     putCar(car) {
//         this.cars.push(car);
//     }

//     addTrafficLight(trafficLight) {
//         this.trafficLight = trafficLight;
//     }

//     removeCar(car) {
//         this.cars = this.cars.filter(c => c.id !== car.id);
//         this.emergencyCars = this.emergencyCars.filter(c => c.id !== car.id);
//     }

//     update() {
//         if (this.trafficLight) {
//             this.trafficLight.tick();
//         }
//     }

//     isIntersection() {
//         return this.type === 'I';
//     }

//     isRoundabout() {
//         return this.type === 'O';
//     }
// }

// class Road {
//     constructor(layout) {
//         this.maxY = layout[0].length;
//         this.maxX = layout.length;
//         this.map = new Map();
//         this.trafficLigts = [];
//         this.map['00'] = this.createTile(0, 0, layout);
//     }

//     updateLights() {
//         this.trafficLigts.forEach(trafficLight => trafficLight.tick());
//     }

//     createTile(x, y, layout) {
//         const type = layout[x]?.[y];

//         if (!type || type === 'X') {
//             return;
//         }

//         const key = `${x}${y}`;

//         if (this.map.has(key)) {
//             return this.map.get(key);
//         }

//         const tile = new Tile(x, y, type);
//         this.map.set(key, tile);

//         const neighbors = {};

//         for (let traversal of TRAVERSALS) {
//             const next = traversal(x, y);

//             const isInMap = this.map.has(next.key);
//             const node = isInMap
//                 ? this.map.get(next.key)
//                 : this.createTile(next.x, next.y, layout);

//             if (node) {
//                 if (!isInMap) {
//                     this.map.set(next.key, node);
//                 }

//                 neighbors[next.dir] = node;
//             }
//         }

//         const possibleNeighbours = tile.isRoundabout()
//             ? this.getRoundaboutNeighbours(tile, neighbors, layout)
//             : neighbors;

//         tile.setNeighbours(possibleNeighbours);

//         if (tile.isIntersection()) {
//             const trafficLight = new TrafficLight();
//             this.trafficLigts.push(trafficLight);
//             tile.addTrafficLight(trafficLight);
//         }


//         return tile;
//     }

//     getRoundaboutNeighbours(current, neighbours, layout) {
//         const { road, moves } = Object.entries(neighbours).reduce((acc, [direction, neighbour]) => {
//             if (neighbour.type === 'R') {
//                 return {
//                     moves: acc.moves,
//                     road: {
//                         [direction]: neighbour
//                     }
//                 };
//             }

//             return {
//                 moves: {
//                     ...acc.moves,
//                     [direction]: neighbour
//                 },
//                 road: acc.road
//             };
//         }, { moves: {}, road: {} })

//         const options = [
//             ['left', 'down'],
//             ['down', 'right'],
//             ['right', 'up'],
//             ['up', 'left'],
//         ];

//         for (let [goto, remove] of options) {
//             if (moves[goto] && moves[remove]) {
//                 return {
//                     [goto]: moves[goto],
//                     ...road
//                 }
//             }
//         }


//         if (moves['right'] && moves['left']) {
//             const x = current.x;
//             for (let idx = current.y + 1; idx < this.maxY; idx++) {
//                 if (layout[x][idx] === 'O' && layout[x + 1][idx] === 'O') {
//                     return {
//                         left: moves.left,
//                         ...road
//                     }
//                 }
//             }

//             return {
//                 right: moves.right,
//                 ...road
//             }
//         }


//         if (moves['up'] && moves['down']) {
//             const y = current.y;
//             for (let idx = current.x + 1; idx < this.maxX; idx++) {
//                 if (layout[idx][y] === 'O' && layout[idx][y + 1] === 'O') {
//                     return {
//                         down: moves.down,
//                         ...road
//                     }
//                 }
//             }

//             return {
//                 up: moves.up,
//                 ...road
//             }
//         }
//     }
// }

// class Simulation {
//     constructor(road, cars) {
//         this.road = road;
//         this.cars = cars.map((car) => {
//             const astar = this.findPath(car);
//             car.tile = astar.startTile;
//             car.path = astar.path;

//             return car;
//         });
//     }

//     findPath(car) {
//         const startTile = this.road.map.get(`${car.start.x}${car.start.y}`);
//         const endTile = this.road.map.get(`${car.end.x}${car.end.y}`);

//         const path = this.aStar(startTile, endTile);

//         return { startTile, endTile, path };
//     }

//     aStar(start, goal) {
//         const openSet = new Set();
//         const cameFrom = new Map();

//         const gScore = new Map();
//         const fScore = new Map();

//         const calculateHeuristic = (tile, goal) => {
//             // A simple heuristic: straight-line distance between tiles
//             return Math.abs(tile.x - goal.x) + Math.abs(tile.y - goal.y);
//         };

//         for (const tile of this.road.map.values()) {
//             gScore.set(`${tile.x}${tile.y}`, Infinity);
//             fScore.set(`${tile.x}${tile.y}`, Infinity);
//         }

//         const startKey = `${start.x}${start.y}`;
//         gScore.set(startKey, 0);
//         fScore.set(startKey, calculateHeuristic(start, goal));
//         openSet.add(start);

//         while (openSet.size > 0) {
//             let current = null;
//             for (const tile of openSet) {
//                 if (!current || fScore.get(`${tile.x}${tile.y}`) < fScore.get(`${current.x}${current.y}`)) {
//                     current = tile;
//                 }
//             }

//             if (current === goal) {
//                 const path = [];
//                 let currentTile = goal;

//                 while (currentTile) {
//                     path.unshift(currentTile);
//                     currentTile = cameFrom.get(`${currentTile.x}${currentTile.y}`);
//                 }

//                 return path;
//             }

//             openSet.delete(current);

//             for (const neighbor of Object.values(current.neighbours)) {
//                 const currentKey = `${current.x}${current.y}`;
//                 const neighborKey = `${neighbor.x}${neighbor.y}`;

//                 const tentativeGScore = gScore.get(currentKey) + 1;
//                 if (tentativeGScore < gScore.get(neighborKey)) {
//                     cameFrom.set(neighborKey, current);
//                     gScore.set(neighborKey, tentativeGScore);
//                     fScore.set(neighborKey, tentativeGScore + calculateHeuristic(neighbor, goal));
//                     openSet.add(neighbor);
//                 }
//             }
//         }

//         // No path found
//         return null;
//     }

//     async run() {
//         const self = this;

//         while (self.cars.length) {
//             let actions = [];
//             const length = self.cars.length;

//             for (let idx = length - 1; idx > -1; idx--) {
//                 const car = self.cars[idx];
//                 const nextMove = car.getNextMove();

//                 if (nextMove) {
//                     const tile = this.road.map.get(`${nextMove.x}${nextMove.y}`)
//                     if (self.canCarMoveToTile(car, tile)) {
//                         const action = () => {
//                             const oldTile = car.tile;

//                             if (oldTile) {
//                                 oldTile.removeCar(car);
//                             }

//                             tile.putCar(car);
//                             car.move(tile);
//                         }
//                         actions.push(action);
//                     }
//                 }

//                 if (!nextMove) {
//                     const car = self.cars[idx];
//                     actions.push(() => {
//                         car.tile.removeCar(car);
//                         self.cars.splice(idx, 1);
//                     })
//                 }
//             }
//             actions.forEach(commit => commit());
//             road.updateLights();
//             this.print();
//             await delay(1000);
//         }
//     }

//     canCarMoveToTile(car, tile) {
//         if (!car || !tile) {
//             return false;
//         }

//         if (car.isEmergencyCar) {
//             return true;
//         }

//         const currentTile = car.tile;
//         const direction = car.getDirection();

//         if (tile.isRoundabout() && !currentTile.isRoundabout()) {
//             const adjecentTile = ROUNDABOUT_NAVIGATION[direction](tile);
//             const key = `${adjecentTile.x}${adjecentTile.y}`;

//             return tile.cars.length === 0
//                 && this.road.map.has(key)
//                 && this.road.map.get(key).cars.length === 0;
//         }

//         if (tile.isIntersection() && tile.trafficLight.isRedLightFor(direction)) {
//             return false;
//         }

//         if (currentTile?.isIntersection()) {
//             const otherCars = currentTile.cars.filter(c => c.id !== car.id);
//             const [opposingCar] = otherCars ?? [];

//             if (opposingCar && opposingCar.hasPriority(car)) {
//                 return false;
//             }
//         }

//         if (tile.cars.length > 0) {
//             const [otherCar] = tile.cars;

//             if (otherCar) {
//                 const otherCarNextTile = otherCar.getNextMove();
//                 const otherCarDirection = otherCar.getDirection();

//                 if (!otherCarNextTile) {
//                     return true;
//                 }

//                 if (direction === otherCarDirection) {
//                     return this.canCarMoveToTile(otherCar, otherCarNextTile);
//                 }

//                 return DIRECTION_INVERSION_MAP[direction] === otherCarDirection
//                     ? true
//                     : this.canCarMoveToTile(otherCar, otherCarNextTile);
//             }
//         }

//         return true;
//     }

//     print() {
//         for (let x = 0; x < this.road.maxX; x++) {
//             let row = '';
//             for (let y = 0; y < this.road.maxY; y++) {
//                 const tile = this.road.map.get(`${x}${y}`);
//                 row += tile?.symbol() ?? 'X ';
//             }
//             console.log(row);
//         }

//         console.log('\r\n');
//         console.log('\r\n');
//     }
// }

// const road = new Road(LAYOUT);
// const cars = [
//     new Car({ x: 4, y: 2 }, { x: 8, y: 9 }),
//     new Car({ x: 4, y: 5 }, { x: 0, y: 0 }),
//     new Car({ x: 4, y: 4 }, { x: 0, y: 0 }),
//     new Car({ x: 8, y: 5 }, { x: 0, y: 0 }, true),
//     new Car({ x: 0, y: 2 }, { x: 8, y: 16 }),
//     new Car({ x: 0, y: 3 }, { x: 8, y: 16 }),
//     new Car({ x: 0, y: 4 }, { x: 8, y: 16 }),
//     new Car({ x: 0, y: 5 }, { x: 8, y: 16 }),
//     new Car({ x: 0, y: 6 }, { x: 8, y: 16 }),
//     new Car({ x: 0, y: 7 }, { x: 8, y: 16 }, true),
// ];

// const simulation = new Simulation(road, cars);
// simulation.run().then(() => console.log('DONE')).catch(console.error);

