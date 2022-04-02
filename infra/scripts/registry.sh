#!/bin/sh
#The image tag
echo "push images to our private registry hub"

#The current version  
tag=${IMAGE_TAG}

#The current image (can be db or api)
image=$1

if [ "$BRANCH_NAME" = "dev" ]; then
   
   image=${DOCKER_PRIVATE_REGISTER}"/release/"${image}:${tag}
   image_latest=${DOCKER_PRIVATE_REGISTER}"/release/${image}:latest"
  
   docker image push --all-tags "${DOCKER_PRIVATE_REGISTER}""/release/${image}"
   docker rmi "${image}" "${image_latest}"


else
   
   image=${DOCKER_PRIVATE_REGISTER}/"stable/"${image}:${tag}
   image_latest=${DOCKER_PRIVATE_REGISTER}/"stable/${image}:latest"
  
   docker image push --all-tags "${DOCKER_PRIVATE_REGISTER}""/stable/${image}"
   docker rmi "${image}" "${image_latest}"

fi