# Build step: alpine-slim is a minimal image lightweight and fast
FROM node:23-alpine AS build

# set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files (fast builds)
COPY package*.json ./

# install dependencies
RUN npm install

# Copy the rest of the application code into /app
COPY . .

# build the application: compile static files
RUN npm run build

# Serve with nginx server
FROM nginx:alpine

# copy the compiled frontend build files from the build stage, earlier step
COPY --from=build /app/build /usr/share/nginx/html
