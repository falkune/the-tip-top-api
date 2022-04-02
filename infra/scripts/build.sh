#!/bin/sh
#The image name (db or api) 
image=$1

#type of image (stable or release)
type=$2

#The image tag
tag=${IMAGE_TAG}

docker build -t ${DOCKER_PRIVATE_REGISTER}/${type}/${image}:${tag} infra/build/${image}/Dockerfile . 