pipeline{
    agent any
    environment {
      DOCKER_PROD_HOST="tcp://45.155.170.65:2375"
      DOCKER_PRIVATE_REGISTER="registry.dsp-archiwebo21-ct-df-an-cd.fr"
      REGISTRY_CRED=credentials('jenkins-registry-credential')
    }
      
    stages{

        stage("build") {

            parallel {
               stage("postgres"){
                   steps{
                     echo "build the postgres image"
                 }    
               }

               stage("api") {
                   when{
                       branch "dev"
                   }
                   steps{
                       sh "docker build -t ${env.DOCKER_PRIVATE_REGISTER}/thetiptop/api:${env.BRANCH_NAME}${env.BUILD_ID} -f infra/test/Dockerfile ."  
                   }
               }

            }
        }

        stage("registry") {
           
           stages{
            
            stage("login"){        
               steps{
                   echo "Login to the docker private registry"
                   sh "docker login -u ${env.REGISTRY_CRED_USR} -p ${env.REGISTRY_CRED_PSW} ${env.DOCKER_PRIVATE_REGISTER}"
                }
              }
            
            stage("push"){
                    parallel {   
                    stage("postgres"){   
                        steps{
                            echo "push postgres image to the docker private registry"
                            }
                        }

                    stage("api"){      
                        steps{
                            echo "push api image to the private registry"
                            sh "docker push ${env.DOCKER_PRIVATE_REGISTER}/thetiptop/api:${env.BRANCH_NAME}${env.BUILD_ID}"
                        }

                    }
                }
            }
          }
        }
    
        


        stage("test"){
           steps{
               echo "launch test env"
           }
        }


        stage("deploy"){

            stages{

                stage ('pre-prod'){
                    steps{
                        echo "launch preprod containers"
                    }
                }

                stage('prod'){
                    steps {
                        echo "launch prod containers"
                    }
                }

            }
                              
        }
    
    }
    
}