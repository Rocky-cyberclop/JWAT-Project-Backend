FROM node:18.1-alpine

ENV PORT ${PORT}

COPY . /home/app

WORKDIR /home/app

RUN npm install

EXPOSE ${PORT}

CMD [ "node", "app.js" ]