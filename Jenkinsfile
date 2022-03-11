pipeline{

    agent any 

    stages{
        stage("A"){
            steps{
                echo "========executing A==========="
            }
            post{
                always{
                    echo "========always========"
                }
                success{
                    echo "========A executed successfully========"
                }
                failure{
                    echo "========A execution failed========"
                }
            }
        }

        stage ("B") {

             steps{
                 
                  echo "Bonjour je suis, je suis à la recherche du jus"

             }   
        
        
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}