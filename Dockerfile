FROM node:18.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm rebuild bcrypt

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]