FROM node:latest as node

# Create app directory
WORKDIR /angular

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#EXPOSE 4200


#CMD [ "npm" , "build"]
# , "--host 0.0.0.0"

# Stage 2
FROM nginx:1.13.12-alpine

COPY --from=node /angular/dist/front-login1 /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf