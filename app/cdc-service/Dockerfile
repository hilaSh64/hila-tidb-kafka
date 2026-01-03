FROM node:20-alpine

WORKDIR /app

COPY app/cdc-service/package.json .
RUN npm install

COPY app/cdc-service/ .

CMD ["npm", "start"]

