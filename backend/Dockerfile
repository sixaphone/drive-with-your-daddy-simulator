FROM node:21-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml /app/

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:21-alpine 

WORKDIR /app

COPY --from=builder /app/dist /app/dist

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/

RUN npm install -g pnpm

RUN pnpm install --prod

EXPOSE 3000

CMD [ "pnpm", "start" ]