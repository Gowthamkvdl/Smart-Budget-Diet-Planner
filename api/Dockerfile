# node img
FROM node:22

# setting the working dir in the container
WORKDIR /usr/src/app

# install dependencies
COPY package.json ./
RUN npm install

# copy the rest of the code to the container
COPY . .

# expose port
EXPOSE 3000

# running cmd
CMD ["npm", "start"]


