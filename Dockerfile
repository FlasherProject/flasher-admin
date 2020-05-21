FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install --production
RUN yarn build
CMD yarn start
