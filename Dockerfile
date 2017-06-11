FROM node:latest

RUN mkdir -p /app
WORKDIR /app


COPY package.json package.json
COPY yarn.lock yarn.lock


RUN npm install yarn -g
RUN yarn install

COPY . .
