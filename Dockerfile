FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
CMD yarn start
