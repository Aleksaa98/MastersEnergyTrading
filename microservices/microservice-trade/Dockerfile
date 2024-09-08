FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY src ./src

# Expose the port
EXPOSE 3003

# Command to run the application
CMD ["node", "src/index.js"]