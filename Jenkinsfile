pipeline{
    
    agent any 
    
    stages{

        stage("build") {

            parallel {
               stage("postgres"){
                   steps{
                     sh "echo build ID:  ${env.BUILD_ID}"
                 }    
               }

               stage("api") {
                   steps{
                       sh "echo Build Tag is: ${env.BUILD_TAG}"
                   }
               }

            }
        }

        stage("registry") {
            steps{
                sh "echo deploy images to the private registry"
            }
        }


        stage("test"){
           steps{
               sh "launch test env"
           }
        }


        stage("deploy"){
           
            parallel {

                stage ('pre-prod'){
                    steps{
                        sh "echo launch preprod containers"
                    }
                }

                stage('prod'){
                    steps {
                        sh "echo launch prod containers"
                    }
                }
            }
                         
        }
    
    }
    
}