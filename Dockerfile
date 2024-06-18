FROM node:18.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

CMD ["sh", "/usr/src/app/entrypoint.sh"]

