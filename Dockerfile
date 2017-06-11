FROM node:latest

COPY . /app
COPY package.json /app/package.json
COPY .env /app/.env

WORKDIR /app

RUN npm install yarn -g
RUN yarn install
