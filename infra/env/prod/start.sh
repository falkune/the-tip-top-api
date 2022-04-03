#!/bin/sh
cd "app/api/prod" || exit
docker compose down
docker rmi registry.dsp-archiwebo21-ct-df-an-cd.fr/stable/api
docker rmi registry.dsp-archiwebo21-ct-df-an-cd.fr/stable/db
docker compose up --build -d  