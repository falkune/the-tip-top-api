#!/bin/sh
#The image tag
echo "push images to our private registry hub"

#The current version  
tag=${IMAGE_TAG}

if [ "$BRANCH_NAME" = "dev" ]; then
   
   db=${DOCKER_PRIVATE_REGISTER}/"release/db":${tag}
   db_latest=${DOCKER_PRIVATE_REGISTER}/"release/db:latest"

   api=${DOCKER_PRIVATE_REGISTER}/"release/api":${tag}
   api_latest=${DOCKER_PRIVATE_REGISTER}/"release/api:latest"
   
   docker image push --all-tags "${DOCKER_PRIVATE_REGISTER}"/"release/db"
   docker image push --all-tags "${DOCKER_PRIVATE_REGISTER}"/"release/api"

   docker rmi "${db}" "${db_latest}" "${api}" "${api_latest}"


else
   
   db=${DOCKER_PRIVATE_REGISTER}/"stable/db":${tag}
   db_latest=${DOCKER_PRIVATE_REGISTER}/"stable/db:latest"

   api=${DOCKER_PRIVATE_REGISTER}/"stable/api":${tag}
   api_latest=${DOCKER_PRIVATE_REGISTER}/"stable/api:latest"
   
   docker image push --all-tags "${DOCKER_PRIVATE_REGISTER}"/"stable/db"
   docker image push --all-tags "${DOCKER_PRIVATE_REGISTER}"/"stable/api"

   docker rmi "${db}" "${db_latest}" "${api}" "${api_latest}"

fi