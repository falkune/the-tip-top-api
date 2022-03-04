ARG TAG=current-alpine

FROM node:$TAG as production 

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build && npm uninstall @nestjs/cli --save

CMD ["node", "dist/main"]
