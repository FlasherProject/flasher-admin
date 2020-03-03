FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
# Fix harcoded path
RUN sed -i 's/\/_auth\/oauth\//\/admin\/_auth\/oauth\//' node_modules/@nuxtjs/auth/lib/providers/_utils.js
RUN yarn build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/admin
RUN sed -i 's/.*error_page  404.*/error_page 404 =200 \/admin;/' /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
