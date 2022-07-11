FROM node:12-alpine as build-stage
WORKDIR /app
COPY . .
RUN apk add --no-cache python2 make g++
RUN yarn install --production
CMD npx browserslist@latest --update-db && yarn build && cp -vrf dist/* /usr/share/nginx/html && sleep infinity
