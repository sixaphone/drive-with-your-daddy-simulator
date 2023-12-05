# Traffic Simulation

This app is a basic simulation of how cars move in a road.
It allows users to spawn in cars and let them move in the grid based in driving rules

## Backend

The backend uses express to server the client and typeorm to persist the data

## Frontend

The UI is written in NextJs and allows the user to configure input and behavior

### How to run

In order for the project to run we can use docker with 

```sh
docker-compose up --build -d
```

The api is on http://localhost:8080
The UI is on https://localhost:3000

We can use tools like lazy docker to monitor logs

Alternatively we can install npm packages using `pnpm` and run the dev or start command 


### Reports

The following reports are available

- All simulations: Get a list of simulations filtered by date
    * http://localhost:8080/simulations?from=2023-12-05T10:31:00
    * http://localhost:8080/simulations?to=2023-12-05T10:31:00
    * http://localhost:8080/simulations?from=2023-12-04T10:31:00&to=2023-12-05T10:31:00

- Get simulation by id: based on the ID get the simulation, cars sorted from fastest to slowest with the difference in expected and actual steps, action logs, how many normal cars and how many emergency cars were in the simulation, how many actions have been recorded, fastest car, slowest car
    * http://localhost:8080/simulations/id

- Get the fastest simulations: get simulations ordered by the least amount of steps taken
    * http://localhost:8080/simulations/fastest


- Get the slowest simulations: get simulations ordered by the mist amount of steps taken
    * http://localhost:8080/simulations/slowest


- Get the least wait time simulations: get simulations where the difference between expected and actual steps is the smallest
    * http://localhost:8080/simulations/smallest-difference