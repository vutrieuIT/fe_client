pipeline {
    agent any
    environment {
        IMAGE_NAME = 'trieuvu/client:new'
    }
    stages {
        stage('Clone') {
            steps {
                git branch: 'protect/deploy', url: 'https://github.com/vutrieuIT/fe_client.git'
            }
        }
        stage('Check Branch') {
            steps {
                script {
                    if (env.GIT_BRANCH != 'origin/protect/deploy') {
                        echo "Not on protect/deploy branch, exiting pipeline. Branch is ${env.GIT_BRANCH}"
                        error("Not on protect/deploy branch, exiting pipeline.")
                    }
                }
            }
        }      
        stage('Build') {
            steps {
                withCredentials([string(credentialsId: 'VITE_GG_CLIENT_ID', variable: 'gg_client_id')]) {
                    sh 'docker build -t --build-arg VITE_GG_CLIENT_ID=${gg_client_id} ${env.IMAGE_NAME} .'
                }
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh 'docker push ${env.IMAGE_NAME}'
                }
            }
        }
    }

    post {
        success {
            mail bcc: '', body: 'build client done', cc: '', from: '', replyTo: '', subject: 'jenkins build', to: 'vutrieu2002@gmail.com'
        }
        failure {
            mail bcc: '', body: 'build client fail', cc: '', from: '', replyTo: '', subject: 'jenkins build', to: 'vutrieu2002@gmail.com'
        }
    }
}
