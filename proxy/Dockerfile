FROM nginx:1.17.4-alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

WORKDIR /etc/nginx/conf.d/

ARG PROXY_URL

RUN sed -i "s,{{PROXY_URL}},$PROXY_URL," default.conf