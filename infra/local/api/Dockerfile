
FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm update && npm install --only=development

COPY . .

RUN npm run build

CMD ["npm run" "start:dev"]
