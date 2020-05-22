#!/bin/sh -e

if [ ! -f ./.env/.installed ]; then
  key=$(openssl rand -base64 128)
  key2=$(openssl rand -base64 128)
  mkdir -p ./.env/ && touch ./.env/api.env
  echo "JWT_ACCESS_TOKEN_SECRET=$key" >> ./.env/api.env
  echo "JWT_REFRESH_TOKEN_SECRET=$key2" >> ./.env/api.env
  touch ./.env/.installed
fi