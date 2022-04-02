#!/bin/sh
cd "app/api/release" || exit
docker compose down
docker compose up -d 