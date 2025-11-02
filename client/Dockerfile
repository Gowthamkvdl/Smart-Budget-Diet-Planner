# node img
FROM node:22 AS build

# working dir
WORKDIR /app

# copy package.json and install dependencies
COPY package.json ./
RUN npm install

# copy rest of the files
COPY . .

RUN npm run build

# serve the app with ngenx
FROM nginx:alpine

# copy the dist folder to the nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
