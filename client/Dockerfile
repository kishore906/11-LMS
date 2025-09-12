# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve stage
FROM node:20-alpine

WORKDIR /app

# Install static server
# Installs the serve package globally inside the container.
# serve is a lightweight static file server for serving production-built frontend apps (like from vite build or create-react-app).
RUN npm install -g serve

# Copy build from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# -s: serve in single-page app (SPA) mode (important for React Router).
# dist: serve the built frontend from the dist directory.
# -l 3000: listen on port 3000.
CMD ["serve", "-s", "dist", "-l", "3000"]

# commands
# cd client
# docker build -t my-frontend .
# docker run -p 3000:3000 my-frontend
