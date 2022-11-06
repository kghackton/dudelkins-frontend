# INFO: build stage
FROM node:14 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

# INFO: production stage
FROM nginx:1.19-alpine as production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html