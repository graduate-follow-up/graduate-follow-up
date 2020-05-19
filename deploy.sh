#!/bin/sh -x

if [ -f dockercompose.lock ]; then
  docker-compose stop
  rm dockercompose.lock
fi

install.sh

docker-compose up -d --build --remove-orphans