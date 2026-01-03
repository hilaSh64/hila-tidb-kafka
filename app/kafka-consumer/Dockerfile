FROM node:20-alpine

WORKDIR /app

COPY app/kafka-consumer/package.json .
RUN npm install

COPY app/kafka-consumer/ .

CMD ["npm", "start"]

