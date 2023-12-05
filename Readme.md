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

We can use tools like lazy docker to monitor logs

Alternatively we can install npm packages using `pnpm` and run the dev or start command 
