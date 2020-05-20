#!/bin/sh -x

if [ ! -f ./.env/.installed ]; then
. ./install.sh
fi

docker-compose up -d --build --remove-orphans