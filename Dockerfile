# Stage 1 - the build process
FROM node:18-alpine as build-deps

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy the rest of your app's source code
COPY . ./

# Build the app
RUN npm run build

# Stage 2 - the production environment
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy the build output and necessary files from stage 1
COPY --from=build-deps /usr/src/app/build ./build
COPY --from=build-deps /usr/src/app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Expose the port the app runs in
EXPOSE 5000

# Serve the app
CMD ["node", "-r", "dotenv/config", "build"]
