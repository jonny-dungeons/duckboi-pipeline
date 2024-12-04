# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.13.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /websocket

COPY . .

RUN corepack enable

RUN corepack prepare yarn@stable --activate

RUN yarn install

EXPOSE 8001

CMD ["yarn", "start"]
