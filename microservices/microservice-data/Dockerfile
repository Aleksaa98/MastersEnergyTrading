# Dockerfile for microservice-data
FROM node:20-alpine

RUN mkdir -p ./src
WORKDIR ./src

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
