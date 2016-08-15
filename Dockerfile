FROM mhart/alpine-node
 
RUN apk add --update python build-base

# Create app directory
RUN mkdir -p /usr/src/app && echo "Simple Webapp for Slot booking"
COPY package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
COPY . /usr/src/app/

# Heroku default port is 5000
EXPOSE 5000

WORKDIR /usr/src/app
CMD ["npm", "start"]
