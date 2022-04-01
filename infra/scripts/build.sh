#!/bin/sh
#Le nom du service db ou api 
#docker_service=$1

#Sa version: stable ou release
#docker_version=$2

#The image


#The image tag
#image_tag="latest"

#docker build -t "${DOCKER_PRIVATE_REGISTER}"/"${docker_service}"/"${docker_version}" infra/build/"${docker_service}"/Dockerfile 

#echo "The service is ""${docker_service}"" and the version of service is ""${docker_version}"""
echo "${TAG_NAME}"

printenv
