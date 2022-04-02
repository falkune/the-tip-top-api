#!/bin/sh
cd "app/api/release" || exit
docker compose down
docker rmi registry.dsp-archiwebo21-ct-df-an-cd.fr/release/api
docker rmi registry.dsp-archiwebo21-ct-df-an-cd.fr/release/db
docker compose up --build -d  