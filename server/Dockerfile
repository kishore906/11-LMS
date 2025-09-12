# Stage 1: Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm ci --only=production

# Copy the source
COPY . .

# Expose the backend port (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]


# commands:
# cd server
# docker build -t my-backend .
# docker run -p 5000:5000 my-backend
