#/bin/sh -x

if [ -f dockercompose.lock ]; then
  docker-compose stop
  rm dockercompose.lock
fi

docker-compose up -d --build --remove-orphans