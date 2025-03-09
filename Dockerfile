# Use the official Node.js Alpine image as the base image for the build stage
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the monorepo's package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy the apps and packages directories
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Build the monorepo
RUN pnpm turbo run build

# Expose the port the server app runs on (adjust if necessary)
EXPOSE 3000

# Start the server app
CMD ["pnpm", "run", "start"]