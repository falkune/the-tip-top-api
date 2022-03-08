ARG TAG=current-alpine3.14

FROM node:$TAG As development

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm update 

RUN npm install --only=development

COPY . .

RUN npm run build
