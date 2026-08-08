FROM node:22-alpine AS build
 
WORKDIR /app

ARG VITE_API_ORIGIN=http://43.205.32.3:3000
ENV VITE_API_ORIGIN=$VITE_API_ORIGIN
 
COPY package*.json ./

RUN npm ci
 
COPY . ./

RUN npm run build
 
FROM nginxinc/nginx-unprivileged:1.29-alpine
 
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
 
EXPOSE 3000

 
