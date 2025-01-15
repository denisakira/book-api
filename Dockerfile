FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY .env .

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]