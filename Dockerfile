FROM node:24-alpine3.23 AS deps

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

FROM node:24-alpine3.23 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules node_modules

COPY src src
COPY tsconfig.json tsconfig.json

COPY package.json package.json
RUN yarn build

CMD yarn dev

FROM node:24-alpine3.23 AS main

WORKDIR /app

COPY --from=builder /app/dist dist
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --production

EXPOSE 3000

CMD yarn start
