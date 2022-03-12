pipeline{
    agent any
    environment {
      DOCKER_PROD_HOST: "tcp://45.155.170.65:2375"
    }  
    
    stages{

        stage("git"){       
              steps {
                 echo "GIT"
              }
           }

        stage("build") {

            parallel {
               
               stage("docker"){
                   steps {
                       sh "docker images"
                       echo "The docker host prod is ${env.DOCKER_PROD_HOST}"
                   }
               }

               stage("postgres"){
                   steps{
                     echo "build ID:  ${env.BUILD_ID}"
                 }    
               }

               stage("api") {
                   steps{
                       echo "Build Tag is: ${env.BUILD_TAG}"
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
           
            parallel {

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