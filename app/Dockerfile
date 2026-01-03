FROM node:20-alpine 

WORKDIR /app

# Copy package files first for better caching
COPY app/package.json .
COPY app/package-lock.json .

RUN npm ci

# Copy the rest of the app
COPY app/. .

CMD ["npm", "start"]


