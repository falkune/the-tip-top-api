pipeline{
    
    agent any 
    
    stages{

        stage("build") {

            parallel {
               stage("postgres"){
                   steps{
                     sh "echo build ${env.BUILD_ID}"
                 }    
               }

               stage("api") {
                   steps{
                       sh "echo api ${env.BUILD_TAG}"
                   }
               }

            }
        }

        stage("registry") {
            steps{
                sh "deploy images to the private registry"
            }
        }


        stage("test"){
           steps{
               sh "launch test env"
           }
        }


        stage("deploy"){
            steps{
                sh "launch prod env"
            }
         
         }
    
    }
    
}