FROM node:latest as node

# Create app directory
WORKDIR /angular

COPY package*.json ./

RUN npm ci

COPY . .

ARG BASE_HREF
RUN npm run build -- --prod --base-href $BASE_HREF

# Stage 2
FROM nginx:1.13.12-alpine

COPY --from=node /angular/dist/front-login1 /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf