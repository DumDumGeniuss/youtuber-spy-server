FROM node:latest

RUN mkdir -p /app
WORKDIR /app


COPY package.json package.json


RUN npm install yarn -g
RUN yarn install

COPY . .
