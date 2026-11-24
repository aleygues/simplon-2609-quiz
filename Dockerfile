FROM node:24.22-alpine3.24

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY tsconfig.json ./
COPY src ./src

CMD ["yarn", "dev"]

