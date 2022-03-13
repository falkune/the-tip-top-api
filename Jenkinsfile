pipeline{
    agent any
    environment {
      DOCKER_PROD_HOST="tcp://45.155.170.65:2375"
      DOCKER_PRIVATE_REGISTER="http://172.12.14.1:8083"
    }  
    
    stages{

        stage("clean"){

            parallel{

              stage("system"){
                  steps {
                     sh "printenv"
                  }
               }

               stage("docker"){
                    steps {
                        sh "docker info"
                        sh "docker images"
                    }
               }
                   
           }
        }


        stage("build") {

            parallel {

               stage("postgres"){
                   steps{
                     echo "build ID:  ${env.BUILD_ID}"
                 }    
               }

               stage("api") {
                   steps{
                       echo "Build Tag is: ${env.BUILD_TAG}"
                       sh "docker build -t "
                       
                   }
               }

            }
        }

        stage("registry") {
            steps{
                echo "deploy images to the private registry"
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
                        echo "aunch preprod containers"
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