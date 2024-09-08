# Dockerfile for microservice-trade
FROM node:20-alpine

# Set the working directory to /app/src where index.js is located
RUN mkdir -p ./src
WORKDIR ./src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port that the application will use
EXPOSE 3003

# Specify the command to run the application
CMD ["node", "index.js"]
