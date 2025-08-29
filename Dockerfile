# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Frontend build stage
FROM base AS frontend-build

# Copy frontend files
COPY bloglist-frontend/package*.json ./
RUN npm install

COPY bloglist-frontend/ ./
RUN npm run build

# Backend build stage
FROM base AS backend-build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy backend package files and install dependencies
COPY blogilista/package-lock.json blogilista/package.json ./
RUN npm ci

# Copy backend application code
COPY blogilista/ ./

# Copy frontend build to backend as 'build' directory
COPY --from=frontend-build /app/dist ./build

# Final stage for app image
FROM base

# Copy built application (backend + frontend build)
COPY --from=backend-build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3003
CMD [ "npm", "run", "start" ]
