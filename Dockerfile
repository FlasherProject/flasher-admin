FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn install --production
CMD yarn build && cp -vrf dist/* /usr/share/nginx/html && sleep infinity
