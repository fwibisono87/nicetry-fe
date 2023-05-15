# Stage 1 - the build process
FROM node:18-alpine as build-deps

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of your app's source code
COPY . ./

# Build the app
RUN yarn build

# Stage 2 - the production environment
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy the build output from stage 1
COPY --from=build-deps /usr/src/app .

# Expose the port the app runs in
EXPOSE 5000

# Serve the app
CMD ["yarn", "start"]
