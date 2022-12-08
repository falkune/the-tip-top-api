
FROM node:16.18.1-alpine3.15 As development

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install --only development

COPY . .

RUN yarn run build

FROM node:16.18.1-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/app/dist ./dist

CMD ["yarn", "run", "start:prod"]