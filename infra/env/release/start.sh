#!/bin/sh
cd "app/api/release" || exit
docker compose down
docker compose ps 
#docker compose up -d 