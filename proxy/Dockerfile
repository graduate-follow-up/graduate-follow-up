FROM nginx:1.17.4-alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

WORKDIR /etc/nginx/conf.d/

ARG PROXY_HOST
ARG PROXY_PORT
ARG PROXY_URL=${PROXY_HOST}:${PROXY_PORT}

RUN sed -i "s/{{PROXY_HOST}}/$PROXY_HOST/" default.conf
# Replace "proxy" by the host:port, removing :80 if needed
RUN sed -i "s/{{PROXY_URL}}/${PROXY_URL%%:80}/" default.conf