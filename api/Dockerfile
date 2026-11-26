FROM node:24.22-alpine3.24 AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:24.22-alpine3.24 AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:24.22-alpine3.24 AS main

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN yarn install --production

CMD ["yarn", "start"]

