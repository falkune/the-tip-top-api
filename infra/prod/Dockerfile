ARG TAG=current-alpine3.14

FROM node:$TAG as production 

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN  npm install -g npm@"V"

RUN npm install

RUN npm install glob rimraf nest

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
